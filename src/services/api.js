import axios from "axios";

// Create an instance of Axios
export const api = axios.create({
  baseURL: `http://localhost:8080/api`, // fetch the data from backend url
  headers: {
    "Content-Type": "application/json",
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
};

export const productApi = {
  getProducts: (hotelId) => api.get(`/hotel/products`, { params: { hotelId } }),
  addProduct: (product, hotelId) =>
    api.post("/hotel/products", product, { params: { hotelId } }),
  updateProduct: (id, product, hotelId) =>
    api.put(`/hotel/products/${id}`, product, { params: { hotelId } }),
  deleteProduct: (id, hotelId) =>
    api.delete(`/hotel/products/${id}`, { params: { hotelId } }),
  getAllProducts: (hotelId) => api.get("/hotel/products", { params: { hotelId } }),
};


export const hotelApi = {
  getHotelById: (id) => api.get(`/hotel/${id}`),
  updateHotel: (id, hotel) => api.put(`/hotel/${id}`, hotel),
  deleteHotel: (id) => api.delete(`/hotel/${id}`),
  partiallyUpdateHotel: (id, hotel) => api.patch(`/hotel/${id}`, hotel),
  createHotel: (hotel) => api.post("/hotel", hotel),
  getHotelByUserId: (userId) => api.get("/hotel/user", { params: { userId } }),
  getAllHotels: () => api.get("/hotel/all"),
};



export const billingApi = {
  createBill: (billData) => api.post("/bill/mobile", billData),

  getBillById: (billId) => api.get(`/bill/${billId}`),

  deleteBill: (billId) => api.delete(`/bill/${billId}`),

  updateBill: (id, data) => api.patch(`/bill/${id}`, data),

  getBills: () => api.get("/bill/all"),

  createBillForWhatsapp: (billData) => api.post("/bill", billData),

  getbillInvoice: (billId) =>
    api.get(`/bill/download-invoice/${billId}`, {
      responseType: "blob",
    }),

  getBillsByProduct: (productName) => api.get(`/bill/bills/by-product`, { params: { productName } }),

  getBillsByDateRange: ({ userId, from, to }) => api.get(`/bill/bills/by-date-range`, { params: { userId, from, to } }),

};



export const dashboardApi = {
  getDailySales: (from, to) => api.get(`/reports/sales/daily?fromDate=${from}&toDate=${to}`),
  getMonthlySales: (year) => api.get(`/reports/sales/monthly?year=${year}`),
  getProductWiseMonthly: (month, year) => api.get(`/reports/sales/monthly/product-wise?month=${month}&year=${year}`),
  getYearlySales: (fromYear, toYear) => api.get(`/reports/sales/yearly?fromYear=${fromYear}&toYear=${toYear}`),
  getBillStats: (type) => api.get(`bill/admin/bills/stats`, { params: { type } })
};
