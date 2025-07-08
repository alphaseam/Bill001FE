import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BillingPage = () => {
  const [customer, setCustomer] = useState({ name: "", mobile: "" });
  const [products, setProducts] = useState([
    { name: "", qty: 0, price: 0, discount: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const billRef = useRef();

  const taxRate = 0.1;

  const handleProductChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = ["qty", "price", "discount"].includes(field)
      ? Number(value)
      : value;
    setProducts(updated);
  };

  const addProduct = () =>
    setProducts([...products, { name: "", qty: 0, price: 0, discount: 0 }]);
  const removeProduct = (index) =>
    setProducts(products.filter((_, i) => i !== index));

  const subtotal = products.reduce((sum, p) => sum + p.qty * p.price, 0);
  const totalDiscount = products.reduce((sum, p) => sum + p.discount, 0);
  const tax = (subtotal - totalDiscount) * taxRate;
  const grandTotal = subtotal - totalDiscount + tax;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, products }),
      });

      if (response.ok) {
        setShowModal(true);
        setTimeout(async () => {
          const canvas = await html2canvas(billRef.current);
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save("invoice.pdf");
        }, 300);

        setCustomer({ name: "", mobile: "" });
        setProducts([{ name: "", qty: 0, price: 0, discount: 0 }]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <div
        ref={billRef}
        className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-md rounded-lg"
      >
        <h1 className="text-lg sm:text-2xl font-bold mb-6 text-center text-gray-700">
          Billing UI
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm sm:text-base">
          <div>
            <label className="block mb-1 font-medium">Customer Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Mobile Number</label>
            <input
              type="tel"
              maxLength={10}
              className="w-full border px-3 py-2 rounded"
              value={customer.mobile}
              onChange={(e) =>
                setCustomer({ ...customer, mobile: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-4 mb-6 text-sm sm:text-base">
          {products.map((item, index) => (
            <div
              key={index}
              className="border p-3 sm:p-4 rounded-lg bg-gray-50 grid grid-cols-1 sm:grid-cols-5 gap-2"
            >
              <input
                type="text"
                placeholder="Product Name"
                className="border px-3 py-2 rounded col-span-full sm:col-span-2 placeholder-gray-500 appearance-none"
                value={item.name}
                onChange={(e) =>
                  handleProductChange(index, "name", e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Quantity"
                className="border px-3 py-2 rounded col-span-full sm:col-span-2 placeholder-gray-500 appearance-none"
                value={item.qty === 0 ? "" : item.qty}
                onChange={(e) =>
                  handleProductChange(index, "qty", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Price"
                className="border px-3 py-2 rounded col-span-full sm:col-span-2 placeholder-gray-500 appearance-none"
                value={item.price === 0 ? "" : item.price}
                onChange={(e) =>
                  handleProductChange(index, "price", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Discount"
                className="border px-3 py-2 rounded col-span-full sm:col-span-2 placeholder-gray-500 appearance-none"
                value={item.discount === 0 ? "" : item.discount}
                onChange={(e) =>
                  handleProductChange(index, "discount", e.target.value)
                }
              />
              {products.length > 1 && (
                <div className="col-span-full bg-red-50 border border-red-200 rounded px-4 py-2 mt-2">
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-600 hover:underline text-xs"
                  >
                    ❌ Remove
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addProduct}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
          >
            + Add More
          </button>
        </div>

        <div className="border-t pt-4 space-y-2 text-sm sm:text-base">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Discount:</span>
            <span>₹ {totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%):</span>
            <span>₹ {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base sm:text-lg border-t pt-2">
            <span>Grand Total:</span>
            <span>₹ {grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="sticky bottom-4 z-10 bg-white pt-4 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? "Generating Bill..." : "Submit"}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md text-center shadow-xl max-h-screen overflow-y-auto text-sm sm:text-base">
            <h2 className="text-lg sm:text-2xl font-bold mb-2 text-green-700">
              ✅ Bill Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your invoice has been saved and downloaded as PDF.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full"
              >
                🖨️ Print Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BillingPage;
