import axios from "axios";

export const getBillById = (billId) => axios.get(`/api/bill/${billId}`);

export const updateBill = (billId, updatedData) =>
  axios.put(`/api/bill/${billId}`, updatedData);
