const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

// Create Order
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

// Get Logged-in User Orders
router.get("/user", protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) {
        console.error("Error fetching user orders:", err.message);
        res.status(500).json({ message: "Server error fetching user orders" });
    }
});

// Get All Orders (Admin)
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

// Update Entire Order Status (Admin)
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

// 🚨 Cancel a Single Item in an Order (User)
router.put("/cancel-item/:orderId/:itemId", protect, async (req, res) => {
    try {
        const { orderId, itemId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Make sure the order belongs to the logged-in user
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to cancel this order" });
        }

        const item = order.items.id(itemId);
        if (!item) return res.status(404).json({ message: "Item not found in order" });

        // Mark as cancelled
        item.status = "Cancelled";
        await order.save();

        res.json({ success: true, message: "Item cancelled successfully", order });
    } catch (err) {
        console.error("Error cancelling item:", err.message);
        res.status(500).json({ message: "Server error cancelling item" });
    }
});

// 🚨 Cancel Entire Order (User)
router.put("/cancel-order/:orderId", protect, async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to cancel this order" });
        }

        order.status = "Cancelled";
        order.items.forEach((item) => {
            item.status = "Cancelled";
        });

        await order.save();

        res.json({ success: true, message: "Order cancelled successfully", order });
    } catch (err) {
        console.error("Error cancelling order:", err.message);
        res.status(500).json({ message: "Server error cancelling order" });
    }
});

module.exports = router;
