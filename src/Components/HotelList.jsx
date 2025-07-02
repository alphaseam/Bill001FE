import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHotels, deleteHotel } from '../api/hotelApi';
import ConfirmationModal from './ConfirmationModal';

const ITEMS_PER_PAGE = 10;

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, [search, page, sortField]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await getHotels(search, page, sortField);
      setHotels(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error loading hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteHotel(confirmId);
      setConfirmId(null);
      fetchHotels();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Hotel List</h2>
        <button
          onClick={() => navigate('/hotels/add')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
        >
          + Add Hotel
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or owner..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        />
        <select
          value={sortField}
          onChange={e => setSortField(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="createdAt">Sort by Date</option>
        </select>
      </div>

      {loading ? (
        <p>Loading hotels...</p>
      ) : (
        <>
          
          <div className="sm:hidden space-y-4">
            {hotels.map(hotel => (
              <div key={hotel.id} className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="mb-2">
                  <strong>Hotel:</strong> {hotel.name}
                </div>
                <div className="mb-2">
                  <strong>Owner:</strong> {hotel.owner}
                </div>
                <div className="mb-2">
                  <strong>Mobile:</strong> {hotel.mobile}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {hotel.email}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>
                  <span className={`ml-2 px-2 py-1 text-sm rounded ${hotel.status ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {hotel.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-end gap-4 mt-2">
                  <button
                    onClick={() => navigate(`/hotels/edit/${hotel.id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(hotel.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Hotel Name</th>
                  <th className="p-2 border">Owner</th>
                  <th className="p-2 border">Mobile</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center">No hotels found</td>
                  </tr>
                ) : (
                  hotels.map(hotel => (
                    <tr key={hotel.id} className="hover:bg-gray-50">
                      <td className="p-2 border">{hotel.name}</td>
                      <td className="p-2 border">{hotel.owner}</td>
                      <td className="p-2 border">{hotel.mobile}</td>
                      <td className="p-2 border">{hotel.email}</td>
                      <td className="p-2 border">
                        <span className={`px-2 py-1 text-sm rounded ${hotel.status ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                          {hotel.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-2 border space-x-2">
                        <button
                          onClick={() => navigate(`/hotels/edit/${hotel.id}`)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(hotel.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      
      <div className="mt-4 flex justify-center gap-2 flex-wrap">
        {[...Array(totalPages).keys()].map(i => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      
      {confirmId && (
        <ConfirmationModal
          title="Delete Hotel"
          message="Are you sure you want to delete this hotel?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
};

export default HotelList;
