import React from 'react';
import QRCodePreview from '../Components/QRCodePreview';

const ProductList = ({ products, onEdit, onDelete }) => {

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Product Inventory</h2>

            <div className="grid gap-4">
                {products.map((product, ind) => (
                    <div>
                        <div
                            key={ind}
                            className="border rounded-lg p-4 shadow-sm bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div className="mb-2 sm:mb-0">
                                <p className="font-bold text-lg ">{product.name}</p>
                                <p className="text-sm">Item Id: {product.size}</p>
                                <p className="text-sm">Price: ₹{product.price}</p>
                                <p className="text-sm">Qty: {product.quantity}</p>
                            </div>

                            <div className="flex gap-2 mt-2 sm:mt-0">
                                <button
                                    onClick={() => onEdit(product.id)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(product.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                                    Delete
                                </button>
                            </div>

                        </div>
                        <div>
                            <div className="flex justify-center">
                                <QRCodePreview
                                    itemNumber={product.name}
                                    price={product.price}
                                    size={product.size}
                                />
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
