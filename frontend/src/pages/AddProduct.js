import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        stock: "",
    });

    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            alert("Please select an image!");
            return;
        }

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("price", formData.price);
            data.append("category", formData.category);
            data.append("stock", formData.stock);
            data.append("image", image);

            const res = await axios.post("http://localhost:5000/api/products", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("✅ Product added successfully!");
            console.log("New product:", res.data);

            setFormData({ name: "", price: "", category: "", stock: "" });
            setImage(null);
            e.target.reset();
        } catch (err) {
            console.error("❌ Error while adding product:", err.response?.data || err);
            alert("Failed to add product. Check backend logs.");
        }
    };

    return (
        <div className="page-container">
            <h2>➕ Add New Product</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    required
                />
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Category"
                    required
                />
                <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Stock Quantity"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
