import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hotelApi } from "../services/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const hotelTypes = ["1-Star", "2-Star", "3-Star", "4-Star", "5-Star"];

const HotelForm = () => {
  const { id } = useParams();
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

  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState({});
  const [loading, setLoading] = useState(false);

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

        Swal.fire({
          icon: "error",
          title: "Failed to load hotel data",
          text: "Please refresh or try again.",
        });
      }
    };

    fetchHotel();
  }, [id]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const newValid = { ...valid };
    const textOnly = /^[A-Za-z\s]+$/;

    switch (name) {
      case "hotelName":
        if (!value) {
          newErrors[name] = "This field is required";
          newValid[name] = false;
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          newErrors[name] = "Only letters, numbers and spaces allowed";
          newValid[name] = false;
        } else {
          delete newErrors[name];
          newValid[name] = true;
        }
        break;

      case "ownerName":
        if (!value) {
          newErrors[name] = "This field is required";
          newValid[name] = false;
        } else if (!textOnly.test(value)) {
          newErrors[name] = "Only letters and spaces allowed";
          newValid[name] = false;
        } else {
          delete newErrors[name];
          newValid[name] = true;
        }
        break;

      case "mobile":
        if (!/^\d{10}$/.test(value)) {
          newErrors[name] = "Mobile number must be exactly 10 digits.";
          newValid[name] = false;
        } else if (/^0{10}$/.test(value)) {
          newErrors[name] = "Mobile number cannot be all zeros.";
          newValid[name] = false;
        } else {
          delete newErrors[name];
          newValid[name] = true;
        }
        break;

      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors[name] = "Valid email required";
          newValid[name] = false;
        } else {
          delete newErrors[name];
          newValid[name] = true;
        }
        break;

      case "address":
        if (!value.trim()) {
          newErrors[name] = "Address is required";
          newValid[name] = false;
        } else if (value.length < 10) {
          newErrors[name] = "Address must be at least 10 characters";
          newValid[name] = false;
        } else if (value.length > 200) {
          newErrors[name] = "Address must not exceed 200 characters";
          newValid[name] = false;
        } else {
          delete newErrors[name];
          newValid[name] = true;
        }
        break;

      case "hotelType":
        if (!value) {
          newErrors[name] = "This field is required";
          newValid[name] = false;
        } else {
          delete newErrors[name];
          newValid[name] = true;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    setValid(newValid);
  };

  const validate = () => {
    const requiredFields = [
      "hotelName",
      "ownerName",
      "mobile",
      "email",
      "address",
      "hotelType",
    ];
    const newErrors = {};
    const newValid = {};

    requiredFields.forEach((key) => {
      const value = formData[key];
      validateField(key, value); // already updates errors and valid

      if (!value || (errors[key] && errors[key] !== "")) {
        newErrors[key] = errors[key] || "This field is required";
        newValid[key] = false;
      } else {
        newValid[key] = true;
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    setValid((prev) => ({ ...prev, ...newValid }));

    return requiredFields.every((field) => newValid[field]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    validateField(name, fieldValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (isEditMode) {
        await hotelApi.updateHotel(id, formData);
        toast.success("Hotel updated successfully!");
        Swal.fire({
          icon: "success",
          title: "Hotel updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await hotelApi.createHotel(formData);
        toast.success("Hotel added successfully!");
        Swal.fire({
          icon: "success",
          title: "Hotel added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      navigate("/admin/hotels");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    Object.values(valid).length === 0
      ? false
      : Object.values(valid).every(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
        {isEditMode ? "Edit Hotel" : "Add Hotel"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Hotel Name", name: "hotelName" },
          { label: "Owner Name", name: "ownerName" },
          {
            label: "Mobile Number",
            name: "mobile",
            type: "tel",
            inputMode: "numeric",
            maxLength: 10,
            pattern: "\\d{10}",
          },
          ,
          { label: "Email", name: "email", type: "email" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block font-medium mb-1">
              {label} <span className="text-red-500">*</span>
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${
                errors[name]
                  ? "border-red-500"
                  : valid[name]
                    ? "border-green-500"
                    : "border-gray-300"
              }`}
              maxLength={name === "mobile" ? 10 : undefined}
              inputMode={name === "mobile" ? "numeric" : undefined}
              pattern={name === "mobile" ? "\\d{10}" : undefined}
            />

            {errors[name] && (
              <p className="text-sm text-red-500 mt-1">{errors[name]}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block font-medium mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className={`w-full border px-3 py-2 rounded resize-none ${
              errors.address
                ? "border-red-500"
                : valid.address
                  ? "border-green-500"
                  : "border-gray-300"
            }`}
          />
          {errors.address && (
            <p className="text-sm text-red-500 mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">GST Number</label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Hotel Type <span className="text-red-500">*</span>
          </label>
          <select
            name="hotelType"
            value={formData.hotelType}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded ${
              errors.hotelType
                ? "border-red-500"
                : valid.hotelType
                  ? "border-green-500"
                  : "border-gray-300"
            }`}
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
          <label className="block font-medium mb-1">
            Active Status <span className="text-red-500">*</span>
          </label>
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
            disabled={!isFormValid || loading}
            className={`px-4 py-2 rounded text-white font-medium w-full sm:w-auto ${
              !isFormValid || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : isEditMode ? "Update Hotel" : "Add Hotel"}
          </button>
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
            onClick={() => navigate("/admin/hotels")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
