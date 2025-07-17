import React, { useEffect, useState } from "react";
import { billingApi } from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function BillList() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBills = async () => {
    try {
      const res = await billingApi.getBills();
      setBills(res.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
      Swal.fire("Error", "Could not fetch bills", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete bill ID: ${id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await billingApi.deleteBill(id);
        setBills((prev) => prev.filter((bill) => bill.id !== id));
        Swal.fire("Deleted!", "Bill has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete bill.", "error");
      }
    }
  };

  const handleInvoiceDownload = async (id) => {
    try {
      const response = await billingApi.getbillInvoice(id);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${id}.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded successfully");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download invoice");
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading bills...</p>;

  if (!bills.length) return <p className="text-center mt-10">No bills found.</p>;

  return (
    <div className="p-4 m-2 sm:p-6 grid gap-3 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Bills</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Bill ID</th>
              <th className="border px-3 py-2">Customer Name</th>
              <th className="border px-3 py-2">Mobile</th>
              <th className="border px-3 py-2">Items</th>
              <th className="border px-3 py-2">Total</th>
              <th className="border px-3 py-2">Actions</th>
              <th className="border px-3 py-2">Download</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => {
              const total =
                bill.items?.reduce((sum, item) => {
                  const itemTotal =
                    (item.unitPrice || 0) * (item.quantity || 0) -
                    (item.discount || 0);
                  return sum + itemTotal;
                }, 0) || 0;

              const customerName = bill.customer?.name || "Not Available";
              const customerMobile = bill.customer?.mobile || "Not Available";

              return (
                <tr key={bill.id}>
                  <td className="border px-3 py-2 text-center">{bill.id}</td>
                  <td className="border px-3 py-2">{customerName}</td>
                  <td className="border px-3 py-2">{customerMobile}</td>
                  <td className="border px-3 py-2 text-center">{bill.items?.length || 0}</td>
                  <td className="border px-3 py-2 text-right">₹{bill.total?.toFixed(2) || total.toFixed(2)}</td>
                  <td className="border px-3 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => navigate(`/admin/billing/edit/${bill.id}`)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bill.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => handleInvoiceDownload(bill.id)}
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
