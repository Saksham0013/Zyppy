import React from "react";
import { addToCart } from "../utils/cartUtils";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} width={150} />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
