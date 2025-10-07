const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/Product");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "zyppy_uploads",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// POST /api/products
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;

    if (!name || !price || !category || !stock) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imageUrl = req.file ? req.file.path : ""; // Cloudinary gives a full URL

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

module.exports = router;
