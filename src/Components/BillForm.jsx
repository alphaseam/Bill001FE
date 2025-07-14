import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";
import { calculateTotals } from "../utils/calculateTotals";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { billingApi } from "../services/api";

const EMPTY_ITEM = { productId: "", productName: "", quantity: 1, unitPrice: 0, discount: 0 };

export default function BillForm({ billData = {} }) {
  const [customerName, setCustomerName] = useState(billData.customerName ?? "");
  const [mobileNumber, setMobileNumber] = useState(billData.mobileNumber ?? "");
  const [items, setItems] = useState(billData.items ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billId, setBillId] = useState(null);

  const { subtotal, tax, finalAmount } = useMemo(() => calculateTotals(items), [items]);

  const updateItem = (idx, field, value) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));

  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);

  const deleteItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const generatePDF = () => {
    const input = document.getElementById("bill-summary");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`bill_${billId}.pdf`);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalid = items.some((it) => !it.productName.trim() || Number(it.quantity) <= 0);
    const isValidMobile = /^\d{10}$/.test(mobileNumber.trim());

    if (!isValidMobile) {
      return Swal.fire("Invalid Mobile Number", "Enter a valid 10-digit number.", "warning");
    }

    if (invalid) {
      return Swal.fire("Validation Error", "Each item needs a name and quantity > 0.", "error");
    }

    try {
      setIsSubmitting(true);
      const res = await billingApi.createBill({ customerName, mobileNumber, items });
      setBillId(res.data.billId);
      Swal.fire("Success", `Bill created! ID: ${res.data.billId}`, "success");
    } catch (err) {
      Swal.fire("Error", "Failed to create bill.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Customer Info</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer Name"
          required
          className="border rounded px-3 py-2 w-full"
        />
        <input
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder="Mobile Number"
          maxLength={10}
          required
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">Bill Items</h2>

      {/* Table for Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border mb-4">
          <thead>
            <tr className="bg-gray-100">
              {['Item', "Product ID", 'Qty', 'Unit Price', 'Discount', 'Total', ''].map((h) => (
                <th key={h} className="border p-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td className="border p-1">
                  <input
                    value={it.productName}
                    onChange={(e) => updateItem(i, "productName", e.target.value)}
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border p-1">
                  <input
                    value={it.productId}
                    onChange={(e) => updateItem(i, "ProductId", e.target.value)}
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={it.quantity}
                    onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={it.unitPrice}
                    onChange={(e) => updateItem(i, "unitPrice", Number(e.target.value))}
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={it.discount}
                    onChange={(e) => updateItem(i, "discount", Number(e.target.value))}
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="border p-1 text-center">₹{it.total?.toFixed(2)}</td>
                <td className="border p-1 text-center">
                  <button
                    type="button"
                    onClick={() => deleteItem(i)}
                    className="text-red-600 hover:text-red-800"
                  >🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card View for Mobile */}
      <div className="sm:hidden flex flex-col gap-4 mb-4">
        {items.map((it, i) => (
          <div key={i} className="border rounded p-3 shadow-sm">
            {["productName", "quantity", "unitPrice", "discount"].map((field) => (
              <div key={field} className="mb-2">
                <label className="block text-sm font-medium">
                  {field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                </label>
                <input
                  type={field === "name" ? "text" : "number"}
                  value={it[field]}
                  onChange={(e) => updateItem(i, field, field === "name" ? e.target.value : Number(e.target.value))}
                  className="w-full border px-2 py-1 mt-1"
                />
              </div>
            ))}
            <div className="flex justify-between mt-2">
              <p className="font-semibold">Total: ₹{it.total?.toFixed(2)}</p>
              <button
                type="button"
                onClick={() => deleteItem(i)}
                className="text-red-600 hover:text-red-800 text-sm"
              >🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >+ Add Item</button>

      <div id="bill-summary" className="mb-6 font-medium">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>Tax (12%): ₹{tax.toFixed(2)}</p>
        <p className="font-bold">Total: ₹{finalAmount.toFixed(2)}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`text-white px-4 py-2 rounded ${isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isSubmitting ? "Creating..." : "Create Bill"}
        </button>




      </div>
    </form>
  );
}