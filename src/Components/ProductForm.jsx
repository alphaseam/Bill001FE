import React, { useState, useEffect } from "react";

const ProductForm = ({ initialData = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        quantity: "",
        size: "",
        image: null,
    });

    useEffect(() => {
        if (initialData) {
            setFormData((prev) => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.quantity) {
            alert("Name, Price, and Quantity are required.");
            return;
        }
        onSubmit(formData);
    };

    return (
        <>
            <h1 className="flex justify-center mt-10 font-extrabold text-4xl">
                Add Product
            </h1>
            <div className="sm:flex mt-10 justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4"
                >
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product Name"
                        required
                        className="border p-2 rounded"
                    />
                    <input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Category"
                        className="border p-2 rounded"
                    />
                    <input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Price"
                        required
                        className="border p-2 rounded"
                    />
                    <input
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        required
                        className="border p-2 rounded"
                    />
                    <input
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        placeholder="Size (used as Item Number)"
                        className="border p-2 rounded"
                    />
                    <input
                        name="image"
                        type="file"
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />
                    <button
                        type="submit"
                        className="col-span-1 sm:col-span-2 bg-green-500 text-white py-2 rounded mt-2"
                    >
                        Save Product
                    </button>
                </form>
            </div>
        </>
    );
};

export default ProductForm;
