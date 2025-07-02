//import api from "./api";
import api from "/src/services/api.js";

export const getBillById = (billId) => api.get(`/bills/${billId}`);

export const updateBill = (billId, updatedData) =>
  api.put(`/bills/${billId}`, updatedData);
