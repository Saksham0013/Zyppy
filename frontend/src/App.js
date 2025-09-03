import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Cart from './pages/cart';
import Checkout from './pages/checkout';
import Address from './pages/address';
import Success from './pages/success';
import MyOrders from './pages/myorders';
import MyProfile from './pages/myprofile';
import ProtectedRoute from './components/protectedroute';
import AdminDashboard from './pages/admindashboard';
// import AdminLayout from "./components/AdminLayout";
import AddProduct from "./pages/AddProduct";
import ManageOrders from "./pages/ManageOrders";
import ManageUsers from "./pages/ManageUsers";
import ManageProducts from "./pages/ManageProducts";
import EditProduct from "./pages/EditProduct";
// import UserDashboard from './pages/UserDashboard';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './App.css';

const RoleProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("zyppyy-token");
  const user = JSON.parse(localStorage.getItem("zyppyy-user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/address" element={<ProtectedRoute><Address /></ProtectedRoute>} />
              <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
              <Route path="/admin/manage-products" element={<ManageProducts />} />
              <Route path="/admin/edit-product/:id" element={<EditProduct />} />
              {/* <Route
                path="/user/dashboard"
                element={
                  <RoleProtectedRoute role="user">
                    <UserDashboard />
                  </RoleProtectedRoute>
                }
              /> */}
              <Route
                path="/admin"
                element={
                  <RoleProtectedRoute role="admin">
                    <AdminDashboard />
                  </RoleProtectedRoute>
                }
              />
              <Route path="/admin/add-product" element={<AddProduct />} />
              <Route path="/admin/manage-orders" element={<ManageOrders />} />
              <Route path="/admin/manage-users" element={<ManageUsers />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
