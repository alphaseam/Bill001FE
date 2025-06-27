import api from "./api";

export const getBillById = (billId) => api.get(`/api/bill/${billId}`);

export const updateBill = (billId, updatedData) =>
  api.put(`/api/bill/${billId}`, updatedData);
