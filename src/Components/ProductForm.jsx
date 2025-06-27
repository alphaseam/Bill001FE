import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import api from "../services/api";
=======
>>>>>>> cf826ad5eed9e7d04d899041fed4a6520df48443

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

<<<<<<< HEAD
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.quantity || !formData.size) {
            alert("Name, Price, and Quantity are required.");
            return;
        }
        try {
            let data = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (val) data.append(key, val);
            });
            await api.post("/products", data);
            alert("Product saved!");
            if (onSubmit) onSubmit(formData);
            setFormData(initialForm);
        } catch (err) {
            alert("Error saving product");
        }
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

=======
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.quantity) {
            alert("Name, Price, and Quantity are required.");
            return;
        }
        onSubmit(formData);
    };

>>>>>>> cf826ad5eed9e7d04d899041fed4a6520df48443
    return (
        <>
            <h1 className="flex justify-center mt-10 font-extrabold text-4xl">
                Add Product
            </h1>
            <div className="sm:flex mt-10 justify-center">
<<<<<<< HEAD
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

=======
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
>>>>>>> cf826ad5eed9e7d04d899041fed4a6520df48443
            </div>
        </>
    );
};

export default ProductForm;
