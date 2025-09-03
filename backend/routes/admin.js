const express = require("express");
const { getAllOrders, addProduct } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");  
const router = express.Router();

router.post("/product", protect, admin, addProduct);

router.get("/orders", protect, admin, getAllOrders);

module.exports = router;
