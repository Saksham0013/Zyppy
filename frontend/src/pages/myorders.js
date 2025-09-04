import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("zyppyy-user"));
  const token = localStorage.getItem("zyppyy-token");

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://zyppy.onrender.com/api/orders/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data.orders || []); 
      } catch (err) {
        console.error("Error fetching orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, navigate]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">🛍 My Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              {/* Order Header */}
              <div className="order-header">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>User ID:</strong> {order.user}</p>
              </div>

              <p><strong>Amount:</strong> ₹{order.amount}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

              {/* Items */}
              <div className="order-products">
                <h4>Items:</h4>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="order-product">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="order-product-img"
                      />
                    )}
                    <div>
                      <p><strong>{item.name}</strong></p>
                      <p>Qty: {item.quantity}</p>
                      <p>₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
