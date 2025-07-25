import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { billingApi } from "../../services/api";

const BillingPage = () => {
  const [customer, setCustomer] = useState({
    customerName: "",
    mobileNumber: "",
  });
  const [products, setProducts] = useState([
    { productId: "", productName: "", quantity: 0, unitPrice: 0, discount: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const billRef = useRef();

  const taxRate = 0.12;

  const handleProductChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = ["quantity", "unitPrice", "discount"].includes(
      field
    )
      ? Number(value)
      : value;
    setProducts(updated);
  };

  const addProduct = () =>
    setProducts([
      ...products,
      {
        productId: "",
        productName: "",
        quantity: 0,
        unitPrice: 0,
        discount: 0,
      },
    ]);

  const removeProduct = (index) =>
    setProducts(products.filter((_, i) => i !== index));

  const subtotal = products.reduce(
    (sum, p) => sum + p.quantity * p.unitPrice,
    0
  );
  const totalDiscount = products.reduce((sum, p) => sum + p.discount, 0);
  const tax = (subtotal - totalDiscount) * taxRate;
  const grandTotal = subtotal - totalDiscount + tax;

  const validateForm = () => {
    if (!customer.customerName.trim()) {
      toast.error("Customer name is required");
      return false;
    }
    if (!/^\d{10}$/.test(customer.mobileNumber)) {
      toast.error("Mobile number must be 10 digits");
      return false;
    }

    for (let p of products) {
      if (!p.productName.trim() || p.quantity <= 0 || p.unitPrice <= 0) {
        toast.error("Please fill all product fields with valid values");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const items = products.map((p) => ({
      productId: p.productId || null,
      productName: p.productName,
      quantity: p.quantity,
      unitPrice: p.unitPrice,
      discount: p.discount,
    }));

    const payload = {
      customerName: customer.customerName,
      mobileNumber: customer.mobileNumber,
      items,
    };

    setLoading(true);
    try {
      const response = await billingApi.createBill(payload);

      if (response.status === 200) {
        setCustomer({ customerName: "", mobileNumber: "" });
        setProducts([
          {
            productId: "",
            productName: "",
            quantity: 0,
            unitPrice: 0,
            discount: 0,
          },
        ]);

        toast.success("Bill created Sucessfully");
      }
    } catch (error) {
      console.error("🔴 Error creating bill:", error);
      toast.error("Failed to create bill. Check console for details.");
    }
    setLoading(false);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        ref={billRef}
        className="max-w-4xl mx-auto p-4 bg-white shadow rounded"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Billing UI</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">Customer Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={customer.customerName}
              onChange={(e) =>
                setCustomer({ ...customer, customerName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block mb-1">Mobile Number</label>
            <input
              type="tel"
              maxLength={10}
              className="w-full border px-3 py-2 rounded"
              value={customer.mobileNumber}
              onChange={(e) =>
                setCustomer({ ...customer, mobileNumber: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {products.map((item, index) => (
            <div key={index} className="border p-4 bg-gray-50 rounded">
              <div className="mb-2">
                <label className="block mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={item.productName}
                  onChange={(e) =>
                    handleProductChange(index, "productName", e.target.value)
                  }
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Product Id</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={item.productId}
                  onChange={(e) =>
                    handleProductChange(index, "productId", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-1">Quantity</label>
                  <input
                    type="number"
                    className="w-full border px-3 py-2 rounded"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      handleProductChange(index, "quantity", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1">Unit Price</label>
                  <input
                    type="number"
                    className="w-full border px-3 py-2 rounded"
                    value={item.unitPrice || ""}
                    onChange={(e) =>
                      handleProductChange(index, "unitPrice", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1">Discount</label>
                  <input
                    type="number"
                    className="w-full border px-3 py-2 rounded"
                    value={item.discount || ""}
                    onChange={(e) =>
                      handleProductChange(index, "discount", e.target.value)
                    }
                  />
                </div>
              </div>
              {products.length > 1 && (
                <button
                  className="text-red-600 mt-2"
                  onClick={() => removeProduct(index)}
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addProduct}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Add More
          </button>
        </div>

        <div className="border-t pt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Discount:</span>
            <span>₹ {totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (12%):</span>
            <span>₹ {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Grand Total:</span>
            <span>₹ {grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Generating Bill..." : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
};

export default BillingPage;
