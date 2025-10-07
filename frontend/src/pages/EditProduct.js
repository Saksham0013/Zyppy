import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: "",
        stock: "",
        image: "", 
    });
    const [file, setFile] = useState(null); 

    useEffect(() => {
        fetch(`https://zyppy.onrender.comhttps://zyppy.onrender.com/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => setProduct(data))
            .catch((err) => console.error("Error fetching product:", err));
    }, [id]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", product.name);
            formData.append("price", product.price);
            formData.append("category", product.category);
            formData.append("stock", product.stock);

            if (file) {
                formData.append("image", file); 
            }

            await fetch(`https://zyppy.onrender.comhttps://zyppy.onrender.com/api/products/${id}`, {
                method: "PUT",
                body: formData, 
            });

            alert("✅ Product updated successfully!");
            navigate("/admin/manage-products");
        } catch (err) {
            console.error("Error updating product:", err);
        }
    };

    return (
        <div className="edit-product">
            <div className="edit-product__card">
                <h1 className="edit-product__title">✏️ Edit Product</h1>
                <form onSubmit={handleSubmit} className="edit-product__form">
                    <label className="edit-product__label">
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            className="edit-product__input"
                            required
                        />
                    </label>

                    <label className="edit-product__label">
                        Price:
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            className="edit-product__input"
                            required
                        />
                    </label>

                    <label className="edit-product__label">
                        Category:
                        <input
                            type="text"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            className="edit-product__input"
                            required
                        />
                    </label>

                    <label className="edit-product__label">
                        Stock:
                        <input
                            type="number"
                            name="stock"
                            value={product.stock}
                            onChange={handleChange}
                            className="edit-product__input"
                            required
                        />
                    </label>

                    <label className="edit-product__label">
                        Image:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="edit-product__input"
                        />
                    </label>

                    {/* {product.image && !file && (
                        <div className="edit-product__preview">
                            <p>Current Image:</p>
                            <img
                                src={product.image}
                                alt="Product Preview"
                                style={{ width: "150px", marginTop: "10px" }}
                            />
                        </div>
                    )} */}

                    {/* {file && (
                        <div className="edit-product__preview">
                            <p>New Image Preview:</p>
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                style={{ width: "150px", marginTop: "10px" }}
                            />
                        </div>
                    )} */}

                    <button type="submit" className="edit-product__btn">
                        💾 Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
