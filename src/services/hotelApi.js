import axios from "axios";

const BASE_URL = "http://localhost:3000/hotels"; // ✅ JSON Server base URL

// ✅ Fetch single hotel by ID
export const getHotelById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

// ✅ Create a new hotel (POST)
export const createHotel = async (data) => {
  const res = await axios.post(BASE_URL, data);
  return res.data;
};

// ✅ Update existing hotel (PUT)
export const updateHotel = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

// ✅ Get paginated + filtered hotel list
export const getHotels = async (
  search = "",
  page = 1,
  limit = 10,
  sort = "name",
  order = "asc"
) => {
  const res = await axios.get(BASE_URL, {
    params: {
      q: search,
      _page: page,
      _limit: limit,
      _sort: sort,
      _order: order,
    },
  });

  return {
    data: res.data,
    total: parseInt(res.headers["x-total-count"] || "0"),
  };
};

// ✅ Delete hotel
export const deleteHotel = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
