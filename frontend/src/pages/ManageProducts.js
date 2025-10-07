import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ManageProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Error fetching products:", err));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await fetch(`http://localhost:5000/api/products/${id}`, {
                    method: "DELETE",
                });
                setProducts(products.filter((p) => p._id !== id));
            } catch (err) {
                console.error("Error deleting product:", err);
            }
        }
    };

    return (
        <div className="manage-products">
            <div className="manage-products__card">
                <h1 className="manage-products__title">🛒 Manage Products</h1>
                <table className="manage-products__table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <img
                                            src={`http://localhost:5000${product.image}`}
                                            alt={product.name}
                                            className="manage-products__image"
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>₹{product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <Link
                                            to={`/admin/edit-product/${product._id}`}
                                            className="manage-products__btn manage-products__btn--edit"
                                        >
                                            ✏️ Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="manage-products__btn manage-products__btn--delete"
                                        >
                                            ❌ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="manage-products__empty">
                                    No products available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProducts;
