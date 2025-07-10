import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { hotelApi } from "../services/api";
import { toast } from "react-toastify";

const hotelTypes = ["1-Star", "2-Star", "3-Star", "4-Star", "5-Star"];

const HotelForm = () => {
  const { id } = useParams();
  console.log("hotelId from URL params:", id);

  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hotelName: "",
    ownerName: "",
    mobile: "",
    email: "",
    address: "",
    gstNumber: "",
    hotelType: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEditMode) return;

    const fetchHotel = async () => {
      try {
        const response = await hotelApi.getHotelById(id);
        const hotel = response?.data?.data;
        if (hotel) {
          setFormData({
            hotelName: hotel.hotelName || "",
            ownerName: hotel.ownerName || "",
            mobile: hotel.mobile || "",
            email: hotel.email || "",
            address: hotel.address || "",
            gstNumber: hotel.gstNumber || "",
            hotelType: hotel.hotelType || "",
            isActive: hotel.isActive ?? true,
          });
        }
      } catch (err) {
        console.error("Failed to fetch hotel:", err);
        toast.error("Failed to fetch hotel");
      }
    };

    fetchHotel();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.hotelName) newErrors.hotelName = "Hotel name is required";
    if (!formData.ownerName) newErrors.ownerName = "Owner name is required";
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Valid 10-digit mobile required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.hotelType) newErrors.hotelType = "Hotel type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    console.log("Submitting form data:", formData);

    try {
      if (isEditMode) {
        await hotelApi.updateHotel(id, formData);
        toast.success("Hotel updated successfully!");
      } else {
        await hotelApi.createHotel(formData);
        toast.success("Hotel added successfully!");
      }
      navigate("/hotels");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          {isEditMode ? "Edit Hotel" : "Add Hotel"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Hotel Name", name: "hotelName" },
            { label: "Owner Name", name: "ownerName" },
            { label: "Mobile Number", name: "mobile", type: "text" },
            { label: "Email", name: "email", type: "email" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label className="block font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
              {errors[name] && (
                <p className="text-sm text-red-500 mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full border px-3 py-2 rounded resize-none"
            />
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">
              GST Number (optional)
            </label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Hotel Type</label>
            <select
              name="hotelType"
              value={formData.hotelType}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Type</option>
              {hotelTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.hotelType && (
              <p className="text-sm text-red-500 mt-1">{errors.hotelType}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium">Active Status</label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Hotel"
                  : "Add Hotel"}
            </button>
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
              onClick={() => navigate("/hotels")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default HotelForm;
