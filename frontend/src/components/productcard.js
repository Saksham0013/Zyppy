import React, { useState, useEffect } from "react";
import { addToCart, getCart } from "../utils/cartUtils";

const ProductCard = ({ product }) => {
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const cart = getCart();
    if (cart.some((item) => item._id === product._id)) {
      setIsInCart(true);
    }
  }, [product._id]);

  const handleAddToCart = () => {
    addToCart(product);
    setIsInCart(true);
  };

  return (
    <div className="product-card">
      <img
        src={
          product.image.startsWith("http")
            ? product.image
            : `https://zyppy.onrender.com${product.image}`
        }
        alt={product.name}
        width={150}
      />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price}</p>
      <button onClick={handleAddToCart} disabled={isInCart}>
        {isInCart ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductCard;
