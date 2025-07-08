import axios from "axios";

// Create an instance of Axios
const api = axios.create({

  baseURL: `http://localhost:8080/api`,// fetch the data from backend url
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = (localStorage.getItem("token"));
    console.log("Token from localStorage:", token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const productApi = {
  getProducts: async (hotelId) => {
    return await api.get("/products", { params: { hotelId } });
  },
  addProduct: async (product, hotelId) => {
    return await api.post("/products", product, { params: { hotelId } });
  },
  updateProduct: async (id, product, hotelId) => {
    return await api.put(`/products/${id}`, product, { params: { hotelId } });
  },
  deleteProduct: async (id, hotelId) => {
    return await api.delete(`/products/${id}`, { params: { hotelId } });
  }
};
export default api;
