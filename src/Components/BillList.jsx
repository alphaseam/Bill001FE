import React, { useEffect, useState } from "react";
import { billingApi } from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function BillList() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchBills = async () => {
        try {
            const res = await billingApi.getBills();
            console.log(res)
            setBills(res.data); // assuming response is an array of bills
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
                setBills(bills.filter((bill) => bill.id !== id));
                Swal.fire("Deleted!", "Bill has been deleted.", "success");
            } catch (err) {
                Swal.fire("Error", "Failed to delete bill.", "error");
            }
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
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill) => {
                            const total = bill.items?.reduce((sum, item) => {
                                const itemTotal = (item.unitPrice || 0) * (item.quantity || 0) - (item.discount || 0);
                                return sum + itemTotal;
                            }, 0);

                            return (
                                <tr key={bill.id}>
                                    <td className="border px-3 py-2 text-center">{bill.id}</td>
                                    <td className="border px-3 py-2">{bill.customer.name}</td>
                                    <td className="border px-3 py-2">{bill.customer.mobile}</td>
                                    <td className="border px-3 py-2 text-center">{bill.items?.length || 0}</td>
                                    <td className="border px-3 py-2 text-right">₹{bill.total}</td>
                                    <td className="border px-3 py-2 flex gap-2 justify-center">
                                        <button
                                            onClick={() => navigate(`/admin/billing/edit/${bill.id}`)}
                                            className="px-2 border-none py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(bill.id)}
                                            className="px-2 py-1 border-none bg-red-500 text-white rounded hover:bg-red-600"
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
        </div>
    );
}
