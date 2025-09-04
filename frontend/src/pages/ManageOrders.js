import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/api/orders", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("zyppyy-token")}`,
                    },
                });
                setOrders(data.orders || []);
            } catch (error) {
                console.error("Error fetching orders:", error.response?.data || error.message);
            }
        };

        fetchOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const { data } = await axios.put(
                `http://localhost:5000/api/orders/${orderId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("zyppyy-token")}`,
                    },
                }
            );

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? data.order : order
                )
            );
        } catch (error) {
            console.error("Error updating status:", error.response?.data || error.message);
        }
    };

    return (
        <div className="orders-container">
            <h2 className="orders-title">📦 Manage Orders</h2>

            {orders.length === 0 ? (
                <p className="no-orders">No orders found.</p>
            ) : (
                <ul className="orders-list">
                    {orders.map((order) => (
                        <li key={order._id} className="order-item">
                            <div className="order-header">
                                <p><strong>Order ID:</strong> {order._id}</p>
                                <p><strong>User:</strong> {order.user?.name || order.address.email}</p>
                            </div>
                            <p><strong>Amount:</strong> ₹{order.amount}</p>

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

                            {user?.role === "admin" ? ( 
                                <div className="status-dropdown">
                                    <label><strong>Status: </strong></label>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                    >
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            ) : (
                                <p><strong>Status:</strong> {order.status}</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManageOrders;
