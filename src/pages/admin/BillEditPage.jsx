import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
//import { getBillById, updateBill } from "../../services/api";

const BillEditPage = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    mobileNumber: "",
    billDate: "",
    items: [],
  });

  const [totals, setTotals] = useState({ subtotal: 0, tax: 0, finalAmount: 0 });

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await getBillById(billId);

        // ✅ Format date as YYYY-MM-DD
        const formattedDate = new Date(response.data.billDate)
          .toISOString()
          .split("T")[0];

        setFormData({
          ...response.data,
          billDate: formattedDate,
        });

        calculateTotals(response.data.items);
      } catch (error) {
        console.error("Error fetching bill:", error);
        alert("Bill not found!");
      }
    };

    fetchBill();
  }, [billId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = ["quantity", "unitPrice", "discount"].includes(
      field
    )
      ? Number(value)
      : value;
    setFormData({ ...formData, items: updatedItems });
    calculateTotals(updatedItems);
  };

  const handleAddItem = () => {
    const newItem = { itemName: "", quantity: 1, unitPrice: 0, discount: 0 };
    const updatedItems = [...formData.items, newItem];
    setFormData({ ...formData, items: updatedItems });
    calculateTotals(updatedItems);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
    calculateTotals(updatedItems);
  };

  const calculateTotals = (items) => {
    const subtotal = items.reduce(
      (acc, item) =>
        acc +
        ((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0) -
          (Number(item.discount) || 0)),
      0
    );
    const tax = subtotal * 0.1;
    const finalAmount = subtotal + tax;
    setTotals({ subtotal, tax, finalAmount });
  };

  const handleSubmit = async () => {
    if (
      !formData.customerName ||
      !formData.mobileNumber ||
      formData.items.length === 0
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await updateBill(billId, formData);
      alert("Bill updated successfully!");
      navigate("/billing");
    } catch (error) {
      console.error("Failed to update bill:", error);
      alert("Failed to update bill.");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Bill #{billId}</h2>

      {/* Bill Info */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Bill Date:</label>
          <input
            type="date"
            name="billDate"
            value={formData.billDate}
            onChange={handleChange}
            className="border p-2 w-full text-sm"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Customer Name:</label>
          <input
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="border p-2 w-full text-sm"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Mobile Number:</label>
          <input
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="border p-2 w-full text-sm"
          />
        </div>
      </div>

      {/* Bill Items Table (Desktop) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Unit Price</th>
              <th className="p-2 border">Discount</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border"></th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => {
              const total =
                (item.quantity || 0) * (item.unitPrice || 0) -
                (item.discount || 0);
              return (
                <tr key={index}>
                  <td className="p-2 border">
                    <input
                      value={item.itemName}
                      onChange={(e) =>
                        handleItemChange(index, "itemName", e.target.value)
                      }
                      className="border p-1 w-full"
                      placeholder="Item Name"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(index, "unitPrice", e.target.value)
                      }
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) =>
                        handleItemChange(index, "discount", e.target.value)
                      }
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="p-2 border text-right">₹{total.toFixed(2)}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Item Cards */}
      <div className="sm:hidden space-y-4">
        {formData.items.map((item, index) => {
          const total =
            (item.quantity || 0) * (item.unitPrice || 0) - (item.discount || 0);
          return (
            <div
              key={index}
              className="border rounded p-3 bg-gray-50 shadow-sm space-y-2"
            >
              <div>
                <label className="text-sm font-medium">Item Name</label>
                <input
                  className="border p-1 w-full"
                  value={item.itemName}
                  onChange={(e) =>
                    handleItemChange(index, "itemName", e.target.value)
                  }
                  placeholder="Item Name"
                />
              </div>
              <div className="flex gap-2">
                <div className="w-1/3">
                  <label className="text-sm">Qty</label>
                  <input
                    type="number"
                    className="border p-1 w-full"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                  />
                </div>
                <div className="w-1/3">
                  <label className="text-sm">Price</label>
                  <input
                    type="number"
                    className="border p-1 w-full"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, "unitPrice", e.target.value)
                    }
                  />
                </div>
                <div className="w-1/3">
                  <label className="text-sm">Discount</label>
                  <input
                    type="number"
                    className="border p-1 w-full"
                    value={item.discount}
                    onChange={(e) =>
                      handleItemChange(index, "discount", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">
                  Total: ₹{total.toFixed(2)}
                </p>
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleAddItem}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Item
      </button>

      {/* Totals */}
      <div className="mt-6 text-right text-sm">
        <p>Subtotal: ₹{totals.subtotal.toFixed(2)}</p>
        <p>Tax (10%): ₹{totals.tax.toFixed(2)}</p>
        <p className="font-bold">
          Final Amount: ₹{totals.finalAmount.toFixed(2)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 sticky bottom-0 bg-white p-4 shadow-inner flex flex-col sm:flex-row gap-4 justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Bill
        </button>
        <button
          onClick={() => navigate("/admin/billing")}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BillEditPage;
