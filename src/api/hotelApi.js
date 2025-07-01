const BASE_URL = '/api/hotels';

// Fetch single hotel by ID (for edit form)
export const getHotelById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch hotel');
  return res.json();
};

// Create a new hotel (POST)
export const createHotel = async (data) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create hotel');
  return res.json();
};

// Update existing hotel (PUT)
export const updateHotel = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update hotel');
  return res.json();
};

// Get paginated hotel list with search
export const getHotels = async (search = '', page = 1, sort = 'name') => {
  const res = await fetch(
    `${BASE_URL}?search=${search}&page=${page}&sort=${sort}`
  );
  if (!res.ok) throw new Error('Failed to fetch hotels');
  return res.json();
};

// Delete hotel
export const deleteHotel = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete hotel');
  return res.json();
};
