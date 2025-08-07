import React, { useEffect, useState } from "react";
import { hotelApi } from "../../services/api";

const ITEMS_PER_PAGE = 10;

const HotelViewOnlyPage = () => {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, [search, sortField, sortOrder, page]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await hotelApi.getAllHotels();
      let hotelList = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      // Filter
      if (search.trim()) {
        const term = search.toLowerCase();
        hotelList = hotelList.filter(
          (h) =>
            h.hotelName?.toLowerCase().includes(term) ||
            h.ownerName?.toLowerCase().includes(term)
        );
      }

      // Sort
      if (sortField === "name") {
        hotelList.sort((a, b) => {
          const result = a.hotelName.localeCompare(b.hotelName);
          return sortOrder === "asc" ? result : -result;
        });
      } else if (sortField === "createdAt") {
        hotelList.sort((a, b) => {
          const result = new Date(a.createdAt) - new Date(b.createdAt);
          return sortOrder === "asc" ? result : -result;
        });
      }

      setTotalPages(Math.ceil(hotelList.length / ITEMS_PER_PAGE));
      const paginated = hotelList.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      );
      setHotels(paginated);
    } catch (err) {
      console.error("Error loading hotels:", err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">View Hotels</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by hotel name or owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        />
        {/* <select
          value={sortField}
          onChange={(e) => toggleSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="createdAt">Sort by Date</option>
        </select> */}
      </div>

      {loading ? (
        <p>Loading hotels...</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="p-2 border cursor-pointer"
                    onClick={() => toggleSort("name")}
                  >
                    Hotel Name{" "}
                    {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="p-2 border">Owner</th>
                  <th className="p-2 border">Mobile</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {hotels.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center">
                      No hotels found
                    </td>
                  </tr>
                ) : (
                  hotels.map((hotel) => (
                    <tr key={hotel.hotelId} className="hover:bg-gray-50">
                      <td className="p-2 border">{hotel.hotelName}</td>
                      <td className="p-2 border">{hotel.ownerName}</td>
                      <td className="p-2 border">{hotel.mobile}</td>
                      <td className="p-2 border">{hotel.email}</td>
                      <td className="p-2 border">
                        <span
                          className={`px-2 py-1 text-sm rounded ${
                            hotel.isActive
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {hotel.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="sm:hidden space-y-4 mt-4">
            {hotels.map((hotel) => (
              <div
                key={hotel.hotelId}
                className="border rounded-lg p-4 shadow-sm bg-white text-sm"
              >
                <div className="mb-2">
                  <strong>Hotel:</strong> {hotel.hotelName}
                </div>
                <div className="mb-2">
                  <strong>Owner:</strong> {hotel.ownerName}
                </div>
                <div className="mb-2">
                  <strong>Mobile:</strong> {hotel.mobile}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {hotel.email}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`ml-1 px-2 py-1 text-xs rounded ${
                      hotel.isActive
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {hotel.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2 flex-wrap">
        {[...Array(totalPages).keys()].map((i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HotelViewOnlyPage;
