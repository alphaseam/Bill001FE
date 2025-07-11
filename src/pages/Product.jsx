import { useState, useEffect } from "react";
import ProductList from "../Components/ProductList";
import ProductForm from "../Components/ProductForm";
import DashboardLayout from "../Components/DashboardLayout";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { productApi } from "../services/api";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [Edit, setEdit] = useState(null);
    const [productAdded, setProductAdded] = useState(false);

    const fetchproducts = async () => {
        try {
            const response = await productApi.getProducts(1); // Assuming hotelId is 1 for this example
            setProducts(response.data);
            console.log("Products fetched:", response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products");
        }
    };
    // Fetch products once
    useEffect(() => {
        fetchproducts();
    }, [productAdded]);


    const handleSave = async (product) => {
        if (Edit) {
            try {
                await productApi.updateProduct(Edit.id, product, 1) // Assuming hotelId is 1 for this example
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
                await productApi.addProduct(product, 1) // Assuming hotelId is 1 for this example
                    .then(res => {
                        setProducts(...products, res.data);
                        toast.success("Product added");
                        setProductAdded(prev => !prev);
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
                productApi.deleteProduct(id, 1) // Assuming hotelId is 1 for this example
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
