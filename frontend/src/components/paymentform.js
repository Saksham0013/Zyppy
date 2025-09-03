import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    useStripe,
    useElements,
    CardElement,
} from "@stripe/react-stripe-js";
import axios from "axios";

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, method }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        const fetchPaymentIntent = async () => {
            try {
                if (method !== "cod") {
                    const res = await axios.post("/api/payment/create-payment-intent", {
                        amount: Number(amount),
                        method,
                    });
                    setClientSecret(res.data.clientSecret);
                }
            } catch (err) {
                console.error("Error creating payment intent:", err);
                alert("Payment setup failed. Please try again.");
            }
        };

        fetchPaymentIntent();
    }, [amount, method]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem("zyppyy-user"));
        const storedCart = JSON.parse(localStorage.getItem("zyppyy-cart")) || [];
        const address = JSON.parse(localStorage.getItem("zyppyy-address"));

        // COD flow
        if (method === "cod") {
            try {
                const orderRes = await axios.post("/api/orders", {
                    user: storedUser?.email,
                    items: storedCart,
                    amount,
                    paymentMethod: "cod",
                    isPaid: false,
                    address,
                });

                localStorage.removeItem("zyppyy-cart");
                alert("✅ Order placed with Cash on Delivery!");
                window.location.href = "/success";
            } catch (err) {
                console.error("COD order failed:", err.response?.data || err.message);
                alert("Order failed: " + (err.response?.data?.message || err.message));
            }
            return;
        }

        // Online Payment flow
        if (!stripe || !elements || !clientSecret) {
            alert("Payment not ready. Please wait...");
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: storedUser?.name || "Zyppy Customer",
                },
            },
        });

        if (result.error) {
            console.error("Stripe error:", result.error.message);
            alert(result.error.message);
        } else if (result.paymentIntent.status === "succeeded") {
            try {
                const orderRes = await axios.post("/api/orders", {
                    user: storedUser?.email,
                    items: storedCart,
                    amount,
                    paymentMethod: method,
                    isPaid: true,
                    transactionId: result.paymentIntent.id,
                    address,
                });

                localStorage.removeItem("zyppyy-cart");
                alert("✅ Payment successful! Order placed.");
                window.location.href = "/success";
            } catch (orderErr) {
                console.error("Order creation failed:", orderErr.response?.data || orderErr.message);
                alert("Payment succeeded, but order failed: " + (orderErr.response?.data?.message || orderErr.message));
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {method !== "cod" && (
                <div style={{ marginBottom: 20 }}>
                    <CardElement options={{ hidePostalCode: true }} />
                </div>
            )}
            <button type="submit" disabled={!stripe && method !== "cod"}>
                {method === "cod" ? "Place Order (COD)" : `Pay ₹${amount}`}
            </button>
        </form>
    );
};

const PaymentForm = () => {
    const [amount, setAmount] = useState(499);
    const [method, setMethod] = useState("card");

    return (
        <div style={{ padding: 20 }}>
            <h2>Checkout</h2>
            <label>Amount (₹): </label>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
            />
            <br />
            <br />
            <label>Payment Method: </label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="cod">Cash on Delivery</option>
            </select>
            <br />
            <br />

            <Elements stripe={stripePromise}>
                <CheckoutForm amount={amount} method={method} />
            </Elements>
        </div>
    );
};

export default PaymentForm;
