const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
        },
        items: [
            {
                _id: false,
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["card", "upi", "cod"],
            required: true,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        transactionId: {
            type: String,
            default: null,
        },
        address: {
            type: Object,
            default: {},
        },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Processing",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
