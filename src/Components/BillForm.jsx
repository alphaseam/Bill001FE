import React, { useState, useEffect } from "react";
import { calculateTotals } from "../utils/calculateTotals";

const BillForm = ({ billData, onSubmit }) => {
  const [form, setForm] = useState({
    customerName: "",
    mobileNumber: "",
    items: [],
    subtotal: 0,
    tax: 0,
    finalAmount: 0,
  });

  useEffect(() => {
    if (billData) {
      setForm({
        customerName: billData.customerName || "",
        mobileNumber: billData.mobileNumber || "",
        items: billData.items || [],
        subtotal: 0,
        tax: 0,
        finalAmount: 0,
      });
    }
  }, [billData]);

  useEffect(() => {
    if (form.items.length > 0) {
      const totals = calculateTotals(form.items);
      setForm((prev) => ({ ...prev, ...totals }));
    }
  }, [form.items]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm({ ...form, items: updatedItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        { customerName: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 },
      ],
    });
  };

  const deleteItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updatedItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const invalid = form.items.some((item) => !item.customerName || item.quantity <= 0);
    if (invalid) {
      alert("Check item rows. Quantity must be > 0 and Name is required.");
      return;
    }
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Info</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          placeholder="Customer Name"
          required
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          value={form.mobileNumber}
          onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
          placeholder="Mobile Number"
          required
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <h2 className="text-xl font-semibold mb-2 text-gray-700">Bill Items</h2>

      {/* ✅ Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border mb-4">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border p-2">Item</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Unit Price</th>
              <th className="border p-2">Discount</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <input
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "unitPrice",
                        Number(e.target.value)
                      )
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "discount",
                        Number(e.target.value)
                      )
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border p-2 text-center">
                  ₹{item.total?.toFixed(2)}
                </td>
                <td className="border p-2 text-center">
                  <button
                    type="button"
                    onClick={() => deleteItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Card View */}
      <div className="sm:hidden flex flex-col gap-4 mb-4">
        {form.items.map((item, index) => (
          <div key={index} className="border rounded p-3 shadow-sm">
            <div className="mb-2">
              <label className="block text-sm font-medium">Item</label>
              <input
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
                className="w-full border px-2 py-1 mt-1"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", Number(e.target.value))
                }
                className="w-full border px-2 py-1 mt-1"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Unit Price</label>
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) =>
                  handleItemChange(index, "unitPrice", Number(e.target.value))
                }
                className="w-full border px-2 py-1 mt-1"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Discount</label>
              <input
                type="number"
                value={item.discount}
                onChange={(e) =>
                  handleItemChange(index, "discount", Number(e.target.value))
                }
                className="w-full border px-2 py-1 mt-1"
              />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-sm font-semibold">
                Total: ₹{item.total?.toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => deleteItem(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Add Item
      </button>

      <div className="mb-6 font-medium text-gray-700">
        <p>Subtotal: ₹{form.subtotal?.toFixed(2)}</p>
        <p>Tax (18%): ₹{form.tax?.toFixed(2)}</p>
        <p className="font-bold">Total: ₹{form.finalAmount?.toFixed(2)}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Bill
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BillForm;
