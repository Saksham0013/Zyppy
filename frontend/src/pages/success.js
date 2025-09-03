import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, paymentMethod } = location.state || {};

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>✅ Order Successful!</h1>
      <p>Thank you for shopping with Zyppy 🎉</p>
      {orderId && <p><strong>Order ID:</strong> {orderId}</p>}
      <p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
      <p>Your order is being processed. You will receive a confirmation email shortly.</p>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default Success;




