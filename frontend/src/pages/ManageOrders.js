import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; 

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const { user, token } = useContext(AuthContext);


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(
                    user.isAdmin
                        ? "http://localhost:5000/api/orders" 
                        : "http://localhost:5000/api/orders", 
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('zyppyy-token')}` },
                    }
                );
                setOrders(data.orders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [user, token]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const { data } = await axios.put(
                `http://localhost:5000/orders/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? data.order : order
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="page-container">
            <h2>📦 Manage Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order._id}>
                            <strong>{order.user}</strong> - {order.status} - ₹{order.amount}
                            {user.isAdmin && (
                                <button
                                    onClick={() =>
                                        updateStatus(
                                            order._id,
                                            order.status === "Processing" ? "Delivered" : "Processing"
                                        )
                                    }
                                >
                                    Update Status
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManageOrders;
