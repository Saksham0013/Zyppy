const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/Product");

const router = express.Router();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Cloudinary storage for image uploads
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "zyppy_uploads",
    allowed_formats: ["auto"],
  },
});

const upload = multer({ storage });

// ✅ POST /api/products - Add new product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;

    if (!name || !price || !category || !stock) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imageUrl = req.file ? req.file.path : "";

    const newProduct = new Product({
      name,
      price,
      category,
      stock,
      image: imageUrl,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// ✅ GET /api/products - Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ GET /api/products/:id - Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// ✅ PUT /api/products/:id - Update product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    const updatedData = { name, price, category, stock };

    if (req.file) {
      updatedData.image = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// ✅ DELETE /api/products/:id - Delete product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ error: "Product not found" });

    res.json({ message: "✅ Product deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
