import React, { useState, useEffect } from "react";


const ProductForm = ({ initialData = {}, onSubmit, submitLabel }) => {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        productName: "",
        productCode: "",
        category: "",
        price: "",
        quantity: "",
        size: "",
        productimage: null,
    });

    const isTextOnly = (str) => /^[A-Za-z\s]+$/.test(str);
    const isnumberOnly = (num) => /^\d*$/.test(num);

    useEffect(() => {
        setFormData((prev) => ({ ...prev, ...initialData }));
    }, [initialData]);

    const validate = (data) => {
        const err = {};

        // Product Name
        if (data.productName.trim() === "")
            err.productName = "Product name is required.";
        else if (data.productName.trim().length < 3)
            err.productName = "Name should be at least 3 characters.";
        else if (!isTextOnly(data.productName))
            err.productName = "Only letters and spaces allowed";

        // Product Code
        if (data.productCode.trim() === "")
            err.productCode = "Product code is required.";
        else if (data.productCode.trim().length < 3)
            err.productCode = "Product code should be at least 3 characters.";

        // Category
        if (data.category.trim() === "")
            err.category = "Category is required.";
        else if (!isTextOnly(data.category))
            err.category = "Only letters and spaces allowed";

        // Price
        if (String(data.price).trim() === "")
            err.price = "Price is required.";
        else if (!isnumberOnly(String(data.price)))
            err.price = "Only numbers are allowed in Price.";
        else if (Number(data.price) <= 0)
            err.price = "Price must be a positive number.";

        if (String(data.quantity).trim() === "")
            err.quantity = "Quantity is required.";
        else if (!isnumberOnly(String(data.quantity)))
            err.quantity = "Only numbers are allowed in Quantity.";
        else if (!Number.isInteger(+data.quantity) || +data.quantity <= 0)
            err.quantity = "Quantity must be a positive integer.";


        // Product Image
        if (data.productimage) {
            const allowed = ["image/png", "image/jpeg", "image/webp"];
            if (!allowed.includes(data.productimage.type))
                err.productimage = "Only PNG, JPEG or WEBP images are allowed.";
            if (data.productimage.size > 2 * 1024 * 1024)
                err.productimage = "Image must be ≤ 2 MB.";
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

        const validationErrors = validate(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            toast.error("Please fix validation errors.");
            return;
        }

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity, 10),
        };

        onSubmit(payload);
        setFormData({
            productName: "",
            productCode: "",
            category: "",
            price: "",
            quantity: "",
            productimage: null,
        });
        setErrors({});
    };


    const resetData = () => {
        setFormData({
            productName: "",
            productCode: "",
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
                            <label htmlFor="productname" className="mb-1 font-medium text-sm">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="productName"
                                name="productName"

                                value={formData.productName}
                                onChange={handleChange}
                                error={errors.productName}
                                className="border p-2 rounded"
                                placeholder="Product Name"
                            />
                            {errors.productName && (
                                <p className="text-red-500 text-xs mt-1">{errors.productName}</p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="productCode" className="mb-1 font-medium text-sm">
                                Product code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="productCode"
                                name="productCode"

                                value={formData.productCode}
                                onChange={handleChange}
                                error={errors.productCode}
                                className="border p-2 rounded"
                                placeholder="Product code"
                            />
                            {errors.productCode && (
                                <p className="text-red-500 text-xs mt-1">{errors.productCode}</p>
                            )}
                        </div>
                        {/* Category */}
                        <div className="flex flex-col">
                            <label htmlFor="category" className="mb-1 font-medium text-sm">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="category"
                                name="category"

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
                                type="text"
                                value={formData.price}
                                onChange={handleChange}

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
                                type="text"
                                value={formData.quantity}
                                onChange={handleChange}

                                error={errors.quantity}
                                className="border p-2 rounded"
                                placeholder="Quantity"
                            />
                            {errors.quantity && (
                                <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                            )}
                        </div>

                        {/* Size / Item Number */}
                        {/* <div className="flex flex-col">
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
                        </div> */}

                        {/* Image upload */}
                        <div className="flex flex-col">
                            <label htmlFor="image" className="mb-1 font-medium text-sm">
                                Product Image
                            </label>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                disabled
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
