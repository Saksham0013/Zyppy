// controllers/orderController.js
const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
    try {
        const { user, items, amount, paymentMethod, transactionId } = req.body;

        const order = new Order({
            user,
            items,
            amount,
            paymentMethod,
            isPaid: paymentMethod !== "cod",
            transactionId: transactionId || null,
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
};
