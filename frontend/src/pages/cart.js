import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("zyppyy-user");
    if (!user) {
      navigate("/login");
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem("zyppyy-cart")) || [];
    setCart(storedCart);
  }, [navigate]);

  const updateQty = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("zyppyy-cart", JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("zyppyy-cart");
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const proceedToPayment = () => {
    localStorage.setItem("zyppyy-cart", JSON.stringify(cart));
    navigate("/address");
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, idx) => (
            <div key={idx} className="cart-item">
              <span>{item.name}</span>
              <span>₹{item.price}</span>
              <span>
                <button onClick={() => updateQty(idx, -1)}>-</button>
                {item.quantity}
                <button onClick={() => updateQty(idx, 1)}>+</button>
              </span>
            </div>
          ))}
          <h3>Total: ₹{total}</h3>

          <div className="cart-actions">
            <button onClick={proceedToPayment}>Proceed to Payment</button> &nbsp;
            <button onClick={clearCart}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
