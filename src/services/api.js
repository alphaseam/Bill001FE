import axios from "axios";

<<<<<<< HEAD
// Create an instance of Axios
export const api = axios.create({

  baseURL: `http://localhost:8080/api`,// fetch the data from backend url
=======
// ✅ Create an Axios instance
const api = axios.create({
  baseURL: `http://localhost:8080/api`, // your backend URL
>>>>>>> 2cf4f0a5b84e9f1c5492657c2ca40fd1bbe44940
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
}

export const productApi = {
  getProducts: (hotelId) => api.get("/products", { params: { hotelId } }),
  addProduct: (product, hotelId) => api.post("/products", product, { params: { hotelId } }),
  updateProduct: (id, product, hotelId) => api.put(`/products/${id}`, product, { params: { hotelId } }),
  deleteProduct: (id, hotelId) => api.delete(`/products/${id}`, { params: { hotelId } }),
  getAllProducts: (hotelId) => api.get("products", { params: { hotelId } }),
};

export const dashboardApi = {
  getsaleReport: (filters) => api.get("/reports/sales", { params: filters }),
}

export const hotelApi = {
  getHotelById: (id) => api.get(`/hotel/${id}`),
  updateHotel: (id, hotel) => api.put(`/hotel/${id}`, hotel),
  deleteHotel: (id) => api.delete(`/hotel/${id}`),
  partallyUpdateHotel: (id, hotel) => api.patch(`/hotel/${id}`, hotel),
  createHotel: (hotel) => api.post("/hotel", hotel),
  getHoetlByUserId: (userId) => api.get("/hotel/user", { params: { userId } }),
  getAllHotels: () => api.get("/hotel/all"),
};

export const billingApi = {
  createBill: (billData) => api.post("/bill/mobile", billData),
  getBillById: (billId) => api.get(`/bill/${billId}`),
  deleteBill: (billId) => api.delete(`/bill/${billId}`),
  updateBill: (billId, bill) => api.put(`/bill/${billId}`, bill),
  getBills: () => api.get("/bill"),
  createBillForWhatsapp: (billData) => api.post("/bill", billData),
};
