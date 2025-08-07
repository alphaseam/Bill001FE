import React, { useEffect, useState } from "react";
import { billingApi } from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function BillList() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ customerName: "", from: "", to: "" });

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

  const handleFilter = async () => {

    if (filters.from && filters.to) {
      const fromDate = new Date(filters.from);
      const toDate = new Date(filters.to);

      if (fromDate > toDate) {
        toast.error("'From Date' cannot be after 'To Date'");
        return;
      }
    }

    try {
      const { data } = await billingApi.getBills();
      let billsData = [...data];

      const hasCustomer = filters.customerName?.trim();
      const hasFromDate = filters.from;
      const hasToDate = filters.to;

      if (hasCustomer) {
        const keyword = filters.customerName.trim().toLowerCase();
        billsData = billsData.filter((bill) =>
          bill.customer?.name?.toLowerCase().includes(keyword)
        );
      }

      if (hasFromDate && hasToDate) {
        const from = new Date(filters.from);
        const to = new Date(filters.to);
        const nextDay = new Date(to);
        nextDay.setDate(to.getDate() + 1);

        billsData = billsData.filter((bill) => {
          const createdAt = new Date(bill.createdAt);
          return createdAt >= from && createdAt < nextDay;
        });
      }

      setBills(billsData);
    } catch (error) {
      console.error("Error filtering bills:", error);
      toast.error("Failed to apply filters!");
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

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3 font-inter">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-5 sm:p-8">
        {/* Filter Section */}
        <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow mb-6 sm:mb-10">
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-700">🔍 Filter Bills</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Customer Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul"
                value={filters.customerName}
                onChange={(e) => setFilters({ ...filters, customerName: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">From Date</label>
              <input
                type="date"
                value={filters.from}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  const from = e.target.value;
                  const to = filters.to;

                  // Auto-clear To Date if it's before new From Date
                  if (to && new Date(from) > new Date(to)) {
                    setFilters({ ...filters, from, to: "" });
                  } else {
                    setFilters({ ...filters, from });
                  }
                }}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">To Date</label>
              <input
                type="date"
                value={filters.to}
                min={filters.from}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              onClick={handleFilter}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setFilters({ customerName: "", from: "", to: "" });
                fetchBills();
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Bill Table */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">🧾 All Bills</h2>
        <div className="grid grid-cols-1 overflow-x-auto my-3 p-4  max-w-4xl mx-auto ">
          <table className="w-full text-sm border-collapse">

            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="px-4 py-2 border">Bill ID</th>
                <th className="px-4 py-2 border">Customer Name</th>
                <th className="px-4 py-2 border">Mobile</th>
                <th className="px-4 py-2 border">Items</th>
                <th className="px-4 py-2 border text-right">Total</th>
                <th className="px-4 py-2 border text-center">Actions</th>
                <th className="px-4 py-2 border text-center">Download</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-blue-600 font-medium">
                    Loading bills...
                  </td>
                </tr>
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No bills found.
                  </td>
                </tr>
              ) : (
                bills.map((bill) => {
                  const total =
                    bill.items?.reduce((sum, item) => {
                      const itemTotal =
                        (item.unitPrice || 0) * (item.quantity || 0) - (item.discount || 0);
                      return sum + itemTotal;
                    }, 0) || 0;

                  const customerName = bill.customer?.name || "Not Available";
                  const customerMobile = bill.customer?.mobile || "Not Available";

                  return (
                    <tr key={bill.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2 border">{bill.id}</td>
                      <td className="px-4 py-2 border">{customerName}</td>
                      <td className="px-4 py-2 border">{customerMobile}</td>
                      <td className="px-4 py-2 border text-center">{bill.items?.length || 0}</td>
                      <td className="px-4 py-2 border text-right">₹{bill.total?.toFixed(2) || total.toFixed(2)}</td>
                      <td className="px-4 py-2 border text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/billing/edit/${bill.id}`)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(bill.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2 border text-center">
                        <button
                          onClick={() => handleInvoiceDownload(bill.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
