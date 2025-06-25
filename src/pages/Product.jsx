import { useState } from "react";
import ProductList from "../Components/ProductList";
import ProductForm from "../Components/ProductForm";
import DashboardLayout from "../Components/DashboardLayout";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    // Handle Add or Update
    const handleSave = (product) => {
        if (editingProduct) {
            // Update existing
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === editingProduct.id ? { ...product, id: editingProduct.id } : p
                )
            );
            setEditingProduct(null);
        } else {
            // Add new
            const newProduct = { ...product, id: Date.now() }; // basic ID
            setProducts((prev) => [...prev, newProduct]);
        }
    };

    // Edit
    const handleEdit = (id) => {
        const found = products.find((p) => p.id === id);
        if (found) setEditingProduct(found);
    };

    // Delete
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setProducts((prev) => prev.filter((p) => p.id !== id));
            if (editingProduct?.id === id) setEditingProduct(null);
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen">
                <ProductForm
                    initialData={editingProduct}
                    submitLabel={editingProduct ? "Update Product" : "Add Product"}
                    onSubmit={handleSave}
                />

                <div className="mt-3">
                    <ProductList
                        products={products}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Product;
