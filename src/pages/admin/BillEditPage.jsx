import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBillById, updateBill } from "../../services/billingService";
import BillForm from "../../Components/BillForm";

const BillEditPage = () => {
  const { billId } = useParams();
  const [billData, setBillData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getBillById(billId)
      .then((res) => setBillData(res.data))
      .catch(() => alert("Failed to load bill"));
  }, [billId]);

  const handleUpdate = (updatedBill) => {
    updateBill(billId, updatedBill)
      .then(() => {
        alert("Bill updated successfully!");
        navigate("/billing");
      })
      .catch(() => alert("Update failed"));
  };

  return (
    <div className="page-container">
      <h2>Edit Bill #{billId}</h2>
      {billData ? (
        <BillForm billData={billData} onSubmit={handleUpdate} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BillEditPage;
