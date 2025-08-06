// BillingPage.jsx
import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { billingApi, hotelApi, productApi } from "../../services/api";

const BillingPage = () => {
  const [customer, setCustomer] = useState({ customerName: "", mobileNumber: "", hotelId: "" });
  const [products, setProducts] = useState([{ productId: "", productName: "", quantity: 1, unitPrice: 0 }]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const billRef = useRef();
  const taxRate = 0.12;

  useEffect(() => {
    (async () => {
      try {
        const res = await hotelApi.getAllHotels();
        setHotels(res.data.data || []);
      } catch (err) {
        console.error("Error fetching hotels:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!customer.hotelId) {
      setAllProducts([]);
      return;
    }
    (async () => {
      try {
        const res = await productApi.getAllProducts(customer.hotelId);
        setAllProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setAllProducts([]);
      }
    })();
  }, [customer.hotelId]);

  const handleProductChange = (index, field, value) => {
    setProducts((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: ["quantity", "unitPrice"].includes(field) ? Number(value) : value } : item
      )
    );
  };

  const handleProductNameSelect = (index, name) => {
    const match = allProducts.find((p) => p.productName.toLowerCase() === name.toLowerCase());
    setProducts((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              productName: name,
              productId: match?.id || "",
              unitPrice: match?.price || 0,
            }
          : item
      )
    );
  };

  const addProduct = () => setProducts([...products, { productId: "", productName: "", quantity: 1, unitPrice: 0 }]);
  const removeProduct = (index) => setProducts(products.filter((_, i) => i !== index));

  const subtotal = products.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);
  const tax = (subtotal - totalDiscount) * taxRate;
  const grandTotal = subtotal - totalDiscount + tax;

  const validateForm = () => {
    if (!customer.customerName.trim()) return toast.error("Customer name is required"), false;
    if (!/^\d{10}$/.test(customer.mobileNumber)) return toast.error("Mobile number must be 10 digits"), false;
    if (!customer.hotelId.trim()) return toast.error("Hotel ID is required"), false;
    for (let p of products) {
      if (!p.productName.trim() || p.quantity <= 0 || p.unitPrice <= 0)
        return toast.error("Please fill all product fields with valid values"), false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        customerName: customer.customerName,
        mobileNumber: customer.mobileNumber,
        hotelId: customer.hotelId,
        items: products.map((p) => ({
          productId: p.productId || null,
          productName: p.productName,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
        })),
        totalDiscount: totalDiscount,
      };

      const res = await billingApi.createBill(payload);
      if (res.status === 200) {
        setCustomer({ customerName: "", mobileNumber: "", hotelId: "" });
        setProducts([{ productId: "", productName: "", quantity: 0, unitPrice: 0 }]);
        setAllProducts([]);
        toast.success("Bill created successfully");
      }
    } catch (err) {
      console.error("🔴 Error creating bill:", err);
      toast.error("Failed to create bill. Check console for details.");
    }
    setLoading(false);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-100 py-10 px-4 font-inter">
        <div ref={billRef} className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">🧾 Hotel Billing System</h1>

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Customer Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
                value={customer.customerName}
                onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Mobile Number</label>
              <input
                type="tel"
                maxLength={10}
                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
                value={customer.mobileNumber}
                onChange={(e) => setCustomer({ ...customer, mobileNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Select Hotel</label>
              <select
                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500"
                value={customer.hotelId}
                onChange={(e) => setCustomer({ ...customer, hotelId: e.target.value })}
              >
                <option value="">-- Select Hotel --</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.hotelId}>
                    {hotel.hotelName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product List */}
          <div className="space-y-6 mb-10">
            {products.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-2xl border border-blue-100 shadow-sm">
                <input
                  list={`product-options-${index}`}
                  type="text"
                  placeholder="Product Name"
                  className="w-full mb-4 border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-400"
                  value={item.productName}
                  onChange={(e) => handleProductNameSelect(index, e.target.value)}
                  disabled={!customer.hotelId}
                />
                <datalist id={`product-options-${index}`}>
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.productName} />
                  ))}
                </datalist>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-700 font-medium">Quantity</label>
                    <input
                      type="number"
                      className="w-full border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-400"
                      value={item.quantity || ""}
                      onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-700 font-medium">Unit Price</label>
                    <input
                      type="number"
                      className="w-full border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-400"
                      value={item.unitPrice || ""}
                      onChange={(e) => handleProductChange(index, "unitPrice", e.target.value)}
                    />
                  </div>
                </div>

                {products.length > 1 && (
                  <button
                    className="text-sm text-red-500 mt-2 hover:underline"
                    onClick={() => removeProduct(index)}
                  >
                    ❌ Remove Product
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addProduct}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl transition"
            >
              + Add More
            </button>
          </div>

          {/* Discount */}
          <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-700">Total Discount</label>
            <input
              type="number"
              className="w-full border px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-400"
              value={totalDiscount}
              onChange={(e) => setTotalDiscount(Number(e.target.value))}
              min={0}
            />
          </div>

          {/* Totals */}
          <div className="border-t pt-5 text-sm space-y-2 text-gray-700">
            <div className="flex justify-between"><span>Subtotal:</span><span>₹ {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Discount:</span><span>₹ {totalDiscount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax (12%):</span><span>₹ {tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-lg font-bold border-t pt-4"><span>Grand Total:</span><span>₹ {grandTotal.toFixed(2)}</span></div>
          </div>

          {/* Submit */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-md transition duration-200"
              disabled={loading}
            >
              {loading ? "Generating Bill..." : "Submit Bill"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingPage;
