import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("zyppyy-user"));

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>👨‍💻 Admin Dashboard</h1>
        <p className="user-info"><strong>Welcome:</strong> {user?.name}</p>
        <p className="user-info"><strong>Email:</strong> {user?.email}</p>
        <p className="user-info"><strong>Role:</strong> {user?.role}</p>

        <div className="admin-controls">
          <h3>Admin Controls</h3>
          <ul>
            <li><Link to="/admin/add-product">➕ Add Product</Link></li>
            <li><Link to="/admin/manage-products">🛒 Manage Products</Link></li>
            <li><Link to="/admin/manage-orders">📦 Manage Orders</Link></li>
            <li><Link to="/admin/manage-users">👥 Manage Users</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
