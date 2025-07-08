import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelById, createHotel, updateHotel } from '../services/hotelApi';

const hotelTypes = ['1-Star', '2-Star', '3-Star', '4-Star', '5-Star'];

const HotelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    mobile: "",
    email: "",
    address: "",
    gst: "",
    type: "",
    status: true,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      getHotelById(id)
        .then((data) => {
          if (data) {
            setFormData({
              name: data.name || "",
              owner: data.owner || "",
              mobile: data.mobile || "",
              email: data.email || "",
              address: data.address || "",
              gst: data.gst || "",
              type: data.type || "",
              status: data.status ?? true,
            });
          }
        })
        .catch((err) => console.error("Failed to fetch hotel:", err));
    }
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Hotel name is required";
    if (!formData.owner) newErrors.owner = "Owner name is required";
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Valid 10-digit mobile required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.type) newErrors.type = "Hotel type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditMode) {
        await updateHotel(id, formData);
      } else {
        await createHotel(formData);
      }
      navigate("/hotels");
    } catch (err) {
      console.error(err);
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
        {isEditMode ? 'Edit Hotel' : 'Add Hotel'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Hotel Name", name: "name" },
          { label: "Owner Name", name: "owner" },
          { label: "Mobile Number", name: "mobile", type: "number" },
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
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Hotel Type</label>
          <select
            name="type"
            value={formData.type}
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
          {errors.type && (
            <p className="text-sm text-red-500 mt-1">{errors.type}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium">Active Status</label>
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
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
            {loading ? "Saving..." : isEditMode ? "Update Hotel" : "Add Hotel"}
          </button>
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
            onClick={() => navigate('/hotels')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
