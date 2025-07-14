import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { billingApi } from "../../services/api";
import { toast } from "react-toastify";

const emptyItem = () => ({
  itemName: "",
  productId: "",
  quantity: 1,
  unitPrice: 0,
  discount: 0,
});

const BillEditPage = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    mobileNumber: "",
    customerId: "", // This can be used to fetch customer details if needed
    billDate: "", // YYYY‑MM‑DD string
    items: [],
  });
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0.12,
    finalAmount: 0,
  });

  /** ---------- DATA FETCH ---------- */
  useEffect(() => {
    (async () => {
      try {
        const { data: bill } = await billingApi.getBillById(billId);

        console.log("Fetched bill:", bill);

        const billDate =
          bill?.createdAt && !isNaN(new Date(bill.createdAt))
            ? new Date(bill.createdAt).toISOString().split("T")[0]
            : "";

        setFormData({
          customerName: bill.customer.name ?? "",
          mobileNumber: bill.customer.mobile ?? "",
          customerId: bill.customer.id ?? "",
          billDate,
          items: bill.items?.length ? bill.items : [],
        });

        calculateTotals(bill.items ?? []);
      } catch (err) {
        console.error("Error fetching bill:", err);
        alert("Bill not found!");
      }
    })();
  }, [billId]);

  const calculateTotals = (items) => {
    const subtotal = items.reduce(
      (acc, itm) =>
        acc +
        ((+itm.quantity || 0) * (+itm.unitPrice || 0) - (+itm.discount || 0)),
      0
    );
    const tax = subtotal * 0.12;
    setTotals({ subtotal, tax, finalAmount: subtotal + tax });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleItemChange = (idx, field, value) => {
    const items = [...formData.items];
    items[idx] = {
      ...items[idx],
      [field]: ["quantity", "unitPrice", "discount"].includes(field)
        ? Number(value)
        : value,
    };
    setFormData({ ...formData, items });
    calculateTotals(items);
  };

  const addItem = () => {
    const items = [...formData.items, emptyItem()];
    setFormData({ ...formData, items });
    calculateTotals(items);
  };

  const deleteItem = (idx) => {
    const items = formData.items.filter((_, i) => i !== idx);
    setFormData({ ...formData, items });
    calculateTotals(items);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.customerName ||
      !formData.mobileNumber ||
      !formData.items.length
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice - item.discount,
      0
    );
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    const payload = {
      customerId: formData.customerId,
      items: formData.items.map((item) => ({
        productId: item.productId || 0, // You might need to add `productId` to your item inputs
        quantity: item.quantity,
        price: item.unitPrice,
      })),
      discount: formData.items.reduce((sum, item) => sum + (item.discount || 0), 0),
      subtotal,
      tax,
      total,
      billDate: formData.billDate,
      remarks: formData.remarks || "",
    };

    try {
      await billingApi.updateBill(billId, payload);
      toast.success("Bill updated successfully!");
      navigate("/admin/billinglist");
    } catch (err) {
      console.error("Failed to update bill:", err);
      toast.error("Failed to update bill.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-6 max-w-5xl mx-auto bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Bill #{billId}</h2>

      {/* ---------- BILL INFO ---------- */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="font-medium mb-1 block">Bill Date:</span>
          <input
            type="date"
            name="billDate"
            value={formData.billDate}
            onChange={handleChange}
            className="border p-2 w-full text-sm"
          />
        </label>

        <label className="block">
          <span className="font-medium mb-1 block">Customer Name:</span>
          <input
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="border p-2 w-full text-sm"
          />
        </label>

        <label className="block">
          <span className="font-medium mb-1 block">Mobile Number:</span>
          <input
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="border p-2 w-full text-sm"
          />
        </label>
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              {["Item", "Product ID", "Qty", "Unit Price", "Discount", "Total", ""].map(
                (h) => (
                  <th key={h} className="p-2 border">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, idx) => {
              const total =
                (+item.quantity || 0) * (+item.unitPrice || 0) -
                (+item.discount || 0);
              return (
                <tr key={idx}>
                  <td className="p-2 border">
                    <input
                      value={item.itemName ?? ""}
                      onChange={(e) =>
                        handleItemChange(idx, "itemName", e.target.value)
                      }
                      className="border p-1 w-full"
                      placeholder="Item Name"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      value={item.productId ?? ""}
                      onChange={(e) =>
                        handleItemChange(idx, "productId", e.target.value)
                      }
                      className="border p-1 w-full"
                      placeholder="Product ID"
                    />
                  </td>
                  {["quantity", "unitPrice", "discount"].map((field) => (
                    <td key={field} className="p-2 border">
                      <input
                        type="number"
                        value={item[field] ?? 0}
                        onChange={(e) =>
                          handleItemChange(idx, field, e.target.value)
                        }
                        className="border p-1 w-full"
                      />
                    </td>
                  ))}
                  <td className="p-2 border text-right">₹{total.toFixed(2)}</td>
                  <td className="p-2 border text-center">
                    <button
                      type="button"
                      onClick={() => deleteItem(idx)}
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

      <div className="sm:hidden space-y-4">
        {formData.items.map((item, idx) => {
          const total =
            (+item.quantity || 0) * (+item.unitPrice || 0) -
            (+item.discount || 0);
          return (
            <div
              key={idx}
              className="border rounded p-3 bg-gray-50 shadow-sm space-y-2"
            >
              <label className="block">
                <span className="text-sm font-medium">Item Name</span>
                <input
                  className="border p-1 w-full"
                  value={item.itemName ?? ""}
                  onChange={(e) =>
                    handleItemChange(idx, "itemName", e.target.value)
                  }
                  placeholder="Item Name"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Product ID</span>
                <input
                  className="border p-1 w-full"
                  value={item.productId ?? ""}
                  onChange={(e) =>
                    handleItemChange(idx, "productId", e.target.value)
                  }
                  placeholder="Product ID"
                />
              </label>

              <div className="flex gap-2">
                {["quantity", "unitPrice", "discount"].map((field) => (
                  <label key={field} className="w-1/3 block">
                    <span className="text-sm capitalize">
                      {field === "unitPrice" ? "Price" : field}
                    </span>
                    <input
                      type="number"
                      className="border p-1 w-full"
                      value={item[field] ?? 0}
                      onChange={(e) =>
                        handleItemChange(idx, field, e.target.value)
                      }
                    />
                  </label>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">
                  Total: ₹{total.toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={() => deleteItem(idx)}
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
        type="button"
        onClick={addItem}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Item
      </button>

      <div className="mt-6 text-right text-sm">
        <p>Subtotal: ₹{totals.subtotal.toFixed(2)}</p>
        <p>Tax (12%): ₹{totals.tax.toFixed(2)}</p>
        <p className="font-bold">
          Final Amount: ₹{totals.finalAmount.toFixed(2)}
        </p>
      </div>

      <div className="mt-6 sticky bottom-0 bg-white p-4 shadow-inner flex flex-col sm:flex-row gap-4 justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Bill
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/billinglist")}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BillEditPage;
