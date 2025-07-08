import axios from "axios";

// ✅ Create an Axios instance
const api = axios.create({
  baseURL: `http://localhost:8080/api`, // your backend URL
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

// ✅ Product APIs
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
  },
};

// ✅ Billing APIs

/**
 * Get bill details by ID
 * @param {string|number} billId
 * @returns {Promise<AxiosResponse>}
 */
export const getBillById = (billId) => api.get(`/bills/${billId}`);

/**
 * Update a bill by ID
 * @param {string|number} billId
 * @param {Object} updatedData
 * @returns {Promise<AxiosResponse>}
 */
export const updateBill = (billId, updatedData) => api.put(`/bills/${billId}`, updatedData);

/**
 * Create a new bill
 * @param {Object} billPayload
 * @returns {Promise<AxiosResponse>}
 */
export const createBill = (billPayload) => api.post(`/bill`, billPayload);

export default api;
