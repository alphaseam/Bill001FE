<<<<<<< HEAD
import { useState, useEffect } from "react";
import ProductList from "../Components/ProductList";
import ProductForm from "../Components/ProductForm";
import DashboardLayout from "../Components/DashboardLayout";
import api from "../services/api";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [Edit, setEdit] = useState(null);

    // Fetch products once
    useEffect(() => {
        api.get("/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error("Error fetching products:", err));
    }, []);


    const handleSave = (product) => {
        if (Edit) {
            api.put(`/products/${Edit.id}`, product)
                .then(res => {
                    setProducts(products.map(p => p.id === Edit.id ? res.data : p));
                    setEdit(null);
                });
        } else {
            api.post("/products", product)
                .then(res => setProducts([...products, res.data]));
        }
    };

    const handleEdit = (id) => {
        const item = products.find(p => p.id === id);
        setEdit(item);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this product?")) {
            api.delete(`/products/${id}`)
                .then(() => setProducts(products.filter(p => p.id !== id)));
            if (Edit?.id === id) setEdit(null);
        }
    };

    console.log("Products:", products);

    return (
        <DashboardLayout>
            <div>
                <ProductForm
                    initialData={Edit}
                    submitLabel={Edit ? "Update Product" : "Add Product"}
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
=======
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
>>>>>>> cf826ad5eed9e7d04d899041fed4a6520df48443
};

export default Product;
