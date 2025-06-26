import { useState } from "react";
import ProductList from "../Components/ProductList";
import ProductForm from "../Components/ProductForm";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Add or Update
  const handleSave = (product) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? { ...product, id: editingProduct.id } : p
        )
      );
      setEditingProduct(null);
    } else {
      const newProduct = { ...product, id: Date.now() };
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>

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
  );
};

export default Product;
