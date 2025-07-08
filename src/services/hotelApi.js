import api from "../services/api.js"
// ✅ Fetch single hotel by ID
export const getHotelById = async (id) => {
  const res = await api.get(`hotels/${id}`);
  return res.data;
};

// ✅ Create a new hotel (POST)
export const createHotel = async (data) => {
  const res = await api.post("hotels", data);
  return res.data;
};

// ✅ Update existing hotel (PUT)
export const updateHotel = async (id, data) => {
  const res = await api.put(`hotels/${id}`, data);
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
  const res = await api.get("hotels", {
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
  const res = await api.delete(`hoy/${id}`);
  return res.data;
};
