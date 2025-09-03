const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, async (req, res) => {
    try {
        const { items, amount, paymentMethod, isPaid, transactionId, address } = req.body;

        if (!items || items.length === 0 || !amount || !paymentMethod) {
            return res.status(400).json({ message: "Missing required order data" });
        }

        const newOrder = new Order({
            user: req.user._id,
            items,
            amount: Number(amount),
            paymentMethod,
            isPaid: isPaid || false,
            transactionId: transactionId || null,
            address: address || {},
            status: "Processing", 
        });

        await newOrder.save();
        return res.status(201).json({ order: newOrder });
    } catch (err) {
        console.error("Order creation error:", err.message);
        return res.status(500).json({ message: "Server error creating order" });
    }
});

router.get("/user", protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) {
        console.error("Error fetching user orders:", err.message);
        res.status(500).json({ message: "Server error fetching user orders" });
    }
});

router.get("/", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email") 
            .sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) {
        console.error("Error fetching all orders:", err.message);
        res.status(500).json({ message: "Server error fetching all orders" });
    }
});

router.put("/:id", protect, admin, async (req, res) => {
    try {
        const validStatuses = ["Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
        const { status } = req.body;

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate("user", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ order });
    } catch (err) {
        console.error("Error updating order:", err.message);
        res.status(500).json({ message: "Server error updating order" });
    }
});

module.exports = router;
