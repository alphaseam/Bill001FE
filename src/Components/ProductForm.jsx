import React, { useState, useEffect } from "react";
import api from "../services/api";

const ProductForm = ({ initialData = {}, onSubmit, submitLabel }) => {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        quantity: "",
        size: "",
        productimage: null,
    });


    useEffect(() => {
        setFormData((prev) => ({ ...prev, ...initialData }));
    }, [initialData]);

    const validate = (data) => {
        const err = {};

        // name
        if (data.name.trim() === "")
            err.name = "Product name is required.";
        else if (data.name.trim().length < 3)
            err.name = "Name should be at least 3 characters.";

        // category
        if (data.category.trim() === "")
            err.category = "Category is required.";

        // price
        if (data.price === "")
            err.price = "Price is required.";
        else if (Number(data.price) <= 0)
            err.price = "Price must be positive.";

        // quantity
        if (data.quantity === "")
            err.quantity = "Quantity is required.";
        else if (!Number.isInteger(+data.quantity) || +data.quantity <= 0)
            err.quantity = "Quantity must be a positive integer.";

        // product image 
        if (data.productimage) {
            const allowed = ["image/png", "image/jpeg", "image/webp"];
            if (!allowed.includes(data.image.type))
                err.image = "Only PNG, JPEG or WEBP images are allowed.";
            if (data.image.size > 2 * 1024 * 1024)
                err.image = "Image must be ≤ 2 MB.";
        }

        return err;
    };


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: files ? files[0] : value });
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const validationErrors = validate(formData);
            if (Object.keys(validationErrors).length) {
                setErrors(validationErrors);
                return; // abort submit
            }
            const data = new FormData();
            Object.entries(formData).forEach(([key, val]) => {
                if (val) data.append(key, val);
            });
            onSubmit(data);
            setFormData(resetData);
            setErrors({});
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrors({ submit: "Failed to submit form. Please try again." });
        }
    };
    const resetData = () => {
        setFormData({
            productName: "",
            category: "",
            price: "",
            quantity: "",
            size: "",
            productimage: null,
        });
    }
    return (
        <>
            <h1 className="flex justify-center mt-3 md:mt-10 font-extrabold text-xl md:text-4xl ">
                {submitLabel}
            </h1>
            <div className="sm:flex mt-3 md:mt-10 justify-center">
                <form onSubmit={handleSubmit} onReset={resetData}>
                    {/* field grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">

                        {/* Product Name */}
                        <div className="flex flex-col">
                            <label htmlFor="productName" className="mb-1 font-medium text-sm">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="productName"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                required
                                error={errors.productName}
                                className="border p-2 rounded"
                                placeholder="Product Name"
                            />
                            {errors.productName && (
                                <p className="text-red-500 text-xs mt-1">{errors.productName}</p>
                            )}
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
                                error={errors.category}
                                value={formData.category}
                                onChange={handleChange}
                                className="border p-2 rounded"
                                placeholder="Category"
                            />
                            {errors.category && (
                                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                            )}
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
                                error={errors.price}
                                className="border p-2 rounded"
                                placeholder="Price"
                            />
                            {errors.price && (
                                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                            )}
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
                                error={errors.quantity}
                                className="border p-2 rounded"
                                placeholder="Quantity"
                            />
                            {errors.quantity && (
                                <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                            )}
                        </div>

                        {/* Size / Item Number */}
                        <div className="flex flex-col">
                            <label htmlFor="size" className="mb-1 font-medium text-sm">
                                Size
                            </label>
                            <input
                                id="size"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className="border p-2 rounded"
                                placeholder="Size"
                            />
                            {errors.size && (
                                <p className="text-red-500 text-xs mt-1">{errors.size}</p>
                            )}
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
                                error={errors.productimage}
                                value={formData.productimage ? formData.productimage.name : ""}
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
                            {submitLabel}
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
