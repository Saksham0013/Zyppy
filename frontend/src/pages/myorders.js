import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("zyppyy-user"));

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/orders/user/${user._id}`)
        .then(res => setOrders(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.map((order, idx) => (
        <div key={idx} className="order-item">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
