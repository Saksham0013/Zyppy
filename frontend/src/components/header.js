import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("zyppyy-user")));
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      const user = JSON.parse(localStorage.getItem("zyppyy-user"));
      setUser(user);

      if (!user) {
        setCartCount(0);
        return;
      }

      const cart = JSON.parse(localStorage.getItem("zyppyy-cart")) || [];
      const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalQty);
    };

    updateCart();
    const interval = setInterval(updateCart, 500);
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.removeItem("zyppyy-user");
    localStorage.removeItem("zyppyy-token");
    navigate("/login");
  };

  return (
    <header className="header">
      <Link to="/" className="logo">Zyppy</Link>

      <nav>
        <Link to="/">Home</Link>

        <Link to="/cart">
          🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {user && <Link to="/my-orders">My Orders</Link>}

        {user ? (
          <>
            {/* {user.role === "user" && <Link to="/dashboard">My Dashboard</Link>} */}
            {user.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
            <Link to="/profile">My Profile</Link>
            <button onClick={logout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;





