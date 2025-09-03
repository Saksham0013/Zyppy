import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2 className="logo">Zyppy Admin</h2>
        <nav>
          <ul>
            <li><Link to="/admin">🏠 Dashboard</Link></li>
            <li><Link to="/admin/add-product">➕ Add Product</Link></li>
            <li><Link to="/admin/manage-orders">📦 Manage Orders</Link></li>
            <li><Link to="/admin/manage-users">👥 Manage Users</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
