import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import { hotelApi } from "../services/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 10;

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const navigate = useNavigate();

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

      // Search filter
      if (search.trim() !== "") {
        const lowerSearch = search.toLowerCase();
        hotelList = hotelList.filter(
          (hotel) =>
            hotel.hotelName?.toLowerCase().includes(lowerSearch) ||
            hotel.ownerName?.toLowerCase().includes(lowerSearch)
        );
      }

      // Sort logic
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

  const confirmDelete = (id) => {
    setConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await hotelApi.deleteHotel(confirmId);
      toast.success("Hotel deleted");
      setConfirmId(null);

      Swal.fire({
        icon: "success",
        title: "Hotel deleted successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      fetchHotels();
    } catch (err) {
      console.error("Failed to delete:", err);
      toast.error("Delete failed");

      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: "Something went wrong. Please try again.",
      });
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Hotel List</h2>
        <button
          onClick={() => navigate("/admin/hotels/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
        >
          + Add Hotel
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by hotel name or owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        />

        <select
          value={sortField}
          onChange={(e) => toggleSort(e.target.value)}
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
          {/* ✅ Desktop Table View */}
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
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center">
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
                          className={`px-2 py-1 text-sm rounded ${hotel.isActive
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                            }`}
                        >
                          {hotel.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-2 border">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/hotels/edit/${hotel.hotelId}`)
                            }
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(hotel.hotelId)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/product/${hotel.hotelId}`)
                            }
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Product
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile View */}
          <div className="sm:hidden space-y-4 mt-4">
            {hotels.length === 0 ? (
              <p className="text-center text-gray-600">No hotels found</p>
            ) : (
              hotels.map((hotel) => (
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
                      className={`ml-1 px-2 py-1 text-xs rounded ${hotel.isActive
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                        }`}
                    >
                      {hotel.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/hotels/edit/${hotel.hotelId}`)
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(hotel.hotelId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/admin/product/${hotel.hotelId}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Product
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2 flex-wrap">
        {[...Array(totalPages).keys()].map((i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white"
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmId && (
        <ConfirmationModal
          title="Delete Hotel"
          message="Are you sure you want to delete this hotel?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
    //</DashboardLayout>
  );
};

export default HotelList;
