import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { billingApi, productApi } from "../../services/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const emptyItem = () => ({
  itemName: "",
  productId: "",
  quantity: 1,
  unitPrice: 0,
});

const BillEditPage = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    mobileNumber: "",
    customerId: "",
    hotelId: "",
    billDate: "",
    totalDiscount: 0, // ✅ Flat discount
    items: [],
  });

  const [allProducts, setAllProducts] = useState([]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0.12,
    discount: 0,
    finalAmount: 0,
  });

  // Fetch bill by ID
  useEffect(() => {
    (async () => {
      try {
        const { data: bill } = await billingApi.getBillById(billId);
        console.log("Fetched bill data:", bill);
        const billDate =
          bill?.createdAt && !isNaN(new Date(bill.createdAt))
            ? new Date(bill.createdAt).toISOString().split("T")[0]
            : "";

        const mappedItems =
          bill.items?.map((item) => ({
            itemName: item.itemName || item.productName || "",
            productId: item.productId || item.product?.id || "",
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || item.price || 0,
          })) || [];

        const discount = bill.discount || 0;

        // Set form data
        setFormData({
          customerName: bill.customer?.name ?? "",
          mobileNumber: bill.customer?.mobile ?? "",
          customerId: bill.customer?.id ?? "",
          hotelId: bill.hotel?.hotelId ?? "",
          billDate,
          totalDiscount: discount,
          items: mappedItems,
        });

        // 👇 Calculate totals immediately after load
        calculateTotals(mappedItems, discount);
      } catch (err) {
        console.error("Error fetching bill:", err);
        toast.error("Bill not found or failed to fetch!");
      }
    })();
  }, [billId]);

  // Fetch all products by hotel ID
  useEffect(() => {
    if (!formData.hotelId) return;
    (async () => {
      try {
        const res = await productApi.getAllProducts(formData.hotelId);
        setAllProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    })();
  }, [formData.hotelId]);

  const calculateTotals = (items, totalDiscount = formData.totalDiscount) => {
    const subtotal = items.reduce(
      (acc, itm) => acc + (+itm.quantity || 0) * (+itm.unitPrice || 0),
      0
    );
    const tax = subtotal * 0.12;
    const discount = +totalDiscount || 0;
    const finalAmount = subtotal + tax - discount;

    setTotals({ subtotal, tax, discount, finalAmount });
  };

  const handleItemChange = (idx, field, value) => {
    const items = [...formData.items];
    items[idx] = {
      ...items[idx],
      [field]: ["quantity", "unitPrice"].includes(field)
        ? Number(value)
        : value,
    };
    setFormData({ ...formData, items });
    calculateTotals(items);
  };

  const handleDiscountChange = (value) => {
    const discount = Number(value);
    setFormData({ ...formData, totalDiscount: discount });
    calculateTotals(formData.items, discount);
  };

  const handleProductNameSelect = (index, name) => {
    const match = allProducts.find(
      (p) => p.productName.toLowerCase() === name.toLowerCase()
    );
    const updatedItems = formData.items.map((item, i) =>
      i === index
        ? {
          ...item,
          itemName: name,
          productId: match?.id || "",
          unitPrice: match?.price || 0,
        }
        : item
    );
    setFormData({ ...formData, items: updatedItems });
    calculateTotals(updatedItems);
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
    console.log("Submitting formData:", formData);

    if (
      !formData.customerName ||
      !formData.mobileNumber ||
      !formData.items.length ||
      formData.items.some(
        (item) =>
          !item.productId ||
          !item.itemName.trim() ||
          item.quantity <= 0 ||
          item.unitPrice <= 0
      )
    ) {
      toast.error("Please fill all required fields with valid values.");
      return;
    }

    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const tax = subtotal * 0.12;
    const total = subtotal + tax - formData.totalDiscount;

    const payload = {
      customerId: formData.customerId,
      items: formData.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.unitPrice,
      })),
      discount: formData.totalDiscount,
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

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded p-4 shadow-sm">
          <span className="text-gray-600 text-sm font-medium block mb-1">
            Bill Date
          </span>
          <p className="text-base font-semibold text-gray-800">
            {formData.billDate}
          </p>
        </div>

        <div className="bg-gray-50 rounded p-4 shadow-sm">
          <span className="text-gray-600 text-sm font-medium block mb-1">
            Customer Name
          </span>
          <p className="text-base font-semibold text-gray-800">
            {formData.customerName}
          </p>
        </div>

        <div className="bg-gray-50 rounded p-4 shadow-sm">
          <span className="text-gray-600 text-sm font-medium block mb-1">
            Mobile Number
          </span>
          <p className="text-base font-semibold text-gray-800">
            {formData.mobileNumber}
          </p>
        </div>
      </div>

      {/* Item List */}
      <div className="space-y-4 mb-4">
        {formData.items.map((item, idx) => (
          <div key={idx} className="border p-3 bg-gray-50 rounded shadow-sm">
            <input
              list={`product-options-${idx}`}
              type="text"
              className="w-full border px-3 py-2 rounded mb-2"
              placeholder="Item Name"
              value={item.itemName}
              onChange={(e) =>
                handleItemChange(idx, "itemName", e.target.value)
              }
              onBlur={(e) => handleProductNameSelect(idx, e.target.value)}
            />
            <datalist id={`product-options-${idx}`}>
              {allProducts.map((p) => (
                <option key={p.id} value={p.productName} />
              ))}
            </datalist>

            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                className="border px-2 py-1 rounded"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(idx, "quantity", e.target.value)
                }
              />
              <input
                type="text"
                className="border px-2 py-1 rounded"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) =>
                  handleItemChange(idx, "unitPrice", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => deleteItem(idx)}
                className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700 transition duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Item
        </button>
      </div>

      {/* Total Discount */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Total Discount (₹)</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={formData.totalDiscount}
          onChange={(e) => handleDiscountChange(e.target.value)}
        />
      </div>

      {/* Totals */}
      <div className="mt-4 border-t pt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹ {totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (12%):</span>
          <span>₹ {totals.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Discount:</span>
          <span>₹ {totals.discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2">
          <span>Final Amount:</span>
          <span>₹ {totals.finalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
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
