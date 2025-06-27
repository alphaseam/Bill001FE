import React from 'react';
import QRCodePreview from '../Components/QRCodePreview';

const ProductList = ({ products, onEdit, onDelete }) => {

    if (!products.length) {
        return (
            <div className="max-w-4xl mx-auto my-8 p-4 shadow-lg rounded-lg bg-white">
                <h2 className="text-xl font-bold mb-4">No Products Available</h2>
                <p className="text-gray-600">Add products to see them listed here.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto my-3 p-4  overflow-y-auto md:overflow-visible shadow-lg rounded-lg bg-white ">
            <h2 className="text-xl font-bold mb-4">Product Inventory</h2>

            <table className=" w-full text-sm border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2  ">Name</th>
                        <th className="border p-2  ">Category</th>
                        <th className="border p-2  ">Price</th>
                        <th className="border p-2  ">Qty</th>
                        <th className="border p-2  ">Size</th>
                        <th className="border p-2  ">Action</th>
                        <th className="border p-2  ">QR Code</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((p, idx) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                            <td className="border p-2  ">{p.name}</td>
                            <td className="border p-2  ">{p.category}</td>
                            <td className="border p-2  ">₹{p.price}</td>
                            <td className="border p-2  ">{p.quantity}</td>
                            <td className="border p-2  ">{p.size}</td>

                            <td className="border p-2">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEdit(p.id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(p.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>

                            <td className="border p-2">
                                <QRCodePreview
                                    itemNumber={p.quantity}
                                    price={p.price}
                                    size={p.size}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
