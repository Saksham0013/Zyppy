import React, { useState, useEffect } from "react";
import ProductCard from "../components/productcard";
import { addToCart } from "../utils/cartUtils";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]); 

  const API_URL =
    process.env.REACT_APP_API_URL ||
    process.env.VITE_API_URL ||
    "https://zyppy.onrender.com";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res1 = await fetch("https://dummyjson.com/products");
        const dummyData = await res1.json();

        const res2 = await fetch(`${API_URL}/api/products`);
        const dbData = await res2.json();

        const formattedDummy = dummyData.products.map((p) => ({
          _id: `dummy-${p.id}`,
          name: p.title,
          price: p.price,
          image: p.thumbnail,
        }));

        const formattedDB = dbData.map((p) => ({
          _id: p._id,
          name: p.name,
          price: p.price,
          image: p.image,
        }));

        setProducts([...formattedDB, ...formattedDummy]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [API_URL]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setCartItems((prev) => [...prev, product._id]); 
  };

  return (
    <div className="home-page">
      <h2>All Products</h2>
      <div className="product-list">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onAddToCart={handleAddToCart}
            isInCart={cartItems.includes(p._id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

































































































































// import React, { useState, useEffect } from 'react';
// import ProductCard from '../components/productcard';
// import { addToCart } from '../utils/cartUtils';

// const Home = () => {
//   const [products, setProducts] = useState([]);

//   const API_URL =
//     process.env.REACT_APP_API_URL ||
//     process.env.VITE_API_URL ||
//     "https://zyppy.onrender.com";

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch(`${API_URL}/api/products`);
//         const data = await res.json();

//         // attach full URL for images
//         const formattedProducts = data.map((p) => ({
//           ...p,
//           image: `${API_URL}${p.image}`,
//         }));

//         setProducts(formattedProducts);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, [API_URL]);

//   return (
//     <div className="home-page">
//       <h2>All Products</h2>
//       <div className="product-list">
//         {products.map((p) => (
//           <ProductCard
//             key={p._id}
//             product={p}
//             onAddToCart={addToCart}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;


