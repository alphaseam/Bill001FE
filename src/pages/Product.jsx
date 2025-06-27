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
};

export default Product;
