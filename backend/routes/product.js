const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/**
 * @route   POST /api/products
 * @desc    Add new product
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;

    if (!name || !price || !category || !stock) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const newProduct = new Product({
      name,
      price,
      category,
      stock,
      image: imagePath,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

/**
 * @route   GET /api/products
 * @desc    Get all products
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 */
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

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;

    const updateData = { name, price, category, stock };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "✅ Product deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
