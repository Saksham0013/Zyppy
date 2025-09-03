const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, method } = req.body;

        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: "Invalid amount value" });
        }

        const amountInPaise = Math.round(Number(amount) * 100);

        if (method === "cod") {
            return res.send({ cod: true, message: "Cash on Delivery selected" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaise,
            currency: "inr",
            payment_method_types: ["card", "upi"],
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Stripe Error:", error); // Log for debugging
        res.status(400).json({ error: error.message });
    }
};
