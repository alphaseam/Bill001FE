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
    if (form.items && form.items.length > 0) {
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
        { name: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 },
      ],
    });
  };

  const deleteItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updatedItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const invalid = form.items.some((item) => !item.name || item.quantity <= 0);
    if (invalid)
      return alert("Check item rows. Quantity must be > 0 and Name required.");
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Customer Info</h3>
      <input
        type="text"
        value={form.customerName}
        onChange={(e) => setForm({ ...form, customerName: e.target.value })}
        placeholder="Customer Name"
        required
      />
      <input
        type="text"
        value={form.mobileNumber}
        onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
        placeholder="Mobile Number"
        required
      />

      <h3>Bill Items</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Discount</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {form.items?.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleItemChange(index, "unitPrice", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.discount}
                  onChange={(e) =>
                    handleItemChange(index, "discount", e.target.value)
                  }
                />
              </td>
              <td>{item.total?.toFixed(2)}</td>
              <td>
                <button type="button" onClick={() => deleteItem(index)}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addItem}>
        + Add Item
      </button>

      <h4>
        Subtotal: ₹{form.subtotal?.toFixed(2)} | Tax: ₹{form.tax?.toFixed(2)} |
        Total: ₹{form.finalAmount?.toFixed(2)}
      </h4>

      <button type="submit">Update Bill</button>
      <button type="button" onClick={() => window.history.back()}>
        Cancel
      </button>
    </form>
  );
};

export default BillForm;
