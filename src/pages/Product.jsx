import { useState, useEffect } from "react";
import ProductList from "../Components/ProductList";
import ProductForm from "../Components/ProductForm";
import DashboardLayout from "../Components/DashboardLayout";
import api from "../services/api";
//import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [Edit, setEdit] = useState(null);

    // Fetch products once
    useEffect(() => {
        api.get("/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error("Error fetching products:", err));
    }, []);


    const handleSave = async (product) => {
        if (Edit) {
            try {
                await api.put(`/products/${Edit.id}`, product)
                    .then(res => {
                        setProducts(products.map(p => p.id === Edit.id ? res.data : p));
                        toast.success("Product updated");
                        setEdit(null);
                    });
            } catch (error) {
                console.error("Error updating product:", error);
                toast.error("Failed to update product");
            }
        } else {
            try {
                await api.post("/products", product)
                    .then((res) => {
                        setProducts([...products, res.data]);
                        toast.success("Product added");
                    });
            } catch (error) {
                console.error("Error adding product:", error);
                toast.error("Failed to add product");
            }

        }
    };

    const handleEdit = (id) => {
        const item = products.find(p => p.id === id);
        setEdit(item);
    };

    const confirmDelete = () =>
        Swal.fire({
            title: "Delete this product?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes",
        });

    const handleDelete = (id) => {
        confirmDelete().then((result) => {
            if (result.isConfirmed) {
                api.delete(`/products/${id}`)
                    .then(() => setProducts(products.filter(p => p.id !== id)));
                if (Edit?.id === id) setEdit(null);
            }
        });
    }


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
