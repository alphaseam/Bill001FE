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
        if (!formData.name || !formData.price || !formData.quantity || !formData.size) {
            alert("Name, Price, and Quantity are required.");
            return;
        }
        onSubmit(formData);
    };

    const Clearform = () => {
        setFormData({
            name: "",
            category: "",
            price: "",
            quantity: "",
            size: "",
            image: null,
        });
    }

    return (
        <>
            <h1 className="flex justify-center mt-10 font-extrabold text-4xl">
                Add Product
            </h1>
            <div className="sm:flex mt-10 justify-center">
                <form onSubmit={handleSubmit} onReset={Clearform}>
                    {/* field grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">

                        {/* Product Name */}
                        <div className="flex flex-col">
                            <label htmlFor="name" className="mb-1 font-medium text-sm">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="border p-2 rounded"
                                placeholder="Product Name"
                            />
                        </div>

                        {/* Category */}
                        <div className="flex flex-col">
                            <label htmlFor="category" className="mb-1 font-medium text-sm">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="category"
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="border p-2 rounded"
                                placeholder="Category"
                            />
                        </div>

                        {/* Price */}
                        <div className="flex flex-col">
                            <label htmlFor="price" className="mb-1 font-medium text-sm">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="border p-2 rounded"
                                placeholder="Price"
                            />
                        </div>

                        {/* Quantity */}
                        <div className="flex flex-col">
                            <label htmlFor="quantity" className="mb-1 font-medium text-sm">
                                Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                className="border p-2 rounded"
                                placeholder="Quantity"
                            />
                        </div>

                        {/* Size / Item Number */}
                        <div className="flex flex-col">
                            <label htmlFor="size" className="mb-1 font-medium text-sm">
                                Size (Item Number)
                            </label>
                            <input
                                id="size"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className="border p-2 rounded"
                                placeholder="Size"
                            />
                        </div>

                        {/* Image upload */}
                        <div className="flex flex-col">
                            <label htmlFor="image" className="mb-1 font-medium text-sm">
                                Product Image
                            </label>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className="border p-2 rounded file:mr-3 file:py-1 file:px-2 file:border-0 file:rounded file:bg-gray-100 file:text-sm"
                            />
                        </div>
                    </div>

                    {/* action buttons */}
                    <div className="grid grid-cols-2 gap-4 p-4">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                        >
                            Save Product
                        </button>
                        <button
                            type="reset"
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                        >
                            Reset Product
                        </button>
                    </div>
                </form>

            </div>
        </>
    );
};

export default ProductForm;
