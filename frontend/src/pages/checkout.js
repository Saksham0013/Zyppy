import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutForm = ({ amount, method, items, user }) => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const address = JSON.parse(localStorage.getItem("zyppyy-address"));
    const token = localStorage.getItem("zyppyy-token");

    if (!token) {
      alert("Session expired, please login again");
      navigate("/login");
      return;
    }

    if (method === "cod") {
      try {
        const orderRes = await axios.post(
          "https://zyppy.onrender.com/api/orders",
          {
            user,
            items,
            amount,
            paymentMethod: "cod",
            isPaid: false,
            address,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.removeItem("zyppyy-cart");

        navigate("/success", {
          state: {
            orderId: orderRes.data._id,
            paymentMethod: "cod",
          },
        });
      } catch (err) {
        console.error("Order error (COD):", err.response?.data || err.message);
        alert("Order failed: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Place Order (COD) - ₹{amount}</button>
    </form>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [method, setMethod] = useState("cod");
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("zyppyy-user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser.email);

    const storedCart = JSON.parse(localStorage.getItem("zyppyy-cart")) || [];
    setItems(storedCart);

    const total = storedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setAmount(total);
  }, [navigate]);

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <p>Total Amount: ₹{amount}</p>

      <label>Payment Method:</label>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="cod">Cash on Delivery</option>
      </select>

      <br />
      <br />

      {items.length === 0 ? (
        <p className="no-items">No items in cart.</p>
      ) : (
        <CheckoutForm
          amount={amount}
          method={method}
          items={items}
          user={user}
        />
      )}
    </div>
  );
};

export default Checkout;
