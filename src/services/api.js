import axios from "axios";

// Create an instance of Axios
export const api = axios.create({

  baseURL: `http://localhost:8080/api`,// fetch the data from backend url
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("accessToken");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});


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
  updateBill: (id, data) => api.patch(`/bill/${id}`, data),
  getBills: () => api.get("/bill/all"),
  createBillForWhatsapp: (billData) => api.post("/bill", billData),
};
