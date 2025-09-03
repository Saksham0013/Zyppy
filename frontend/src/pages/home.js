import React, { useState, useEffect } from "react";
import ProductCard from "../components/productcard";
import { addToCart } from "../utils/cartUtils";

const Home = () => {
  const [products, setProducts] = useState([]);

  const API_URL =
    process.env.REACT_APP_API_URL ||
    process.env.VITE_API_URL ||
    "http://localhost:5000";

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
          image: `${API_URL}${p.image}`, 
        }));

        setProducts([...formattedDB, ...formattedDummy]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [API_URL]);

  return (
    <div className="home-page">
      <h2>All Products</h2>
      <div className="product-list">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} onAddToCart={addToCart} />
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

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/products");
//         const data = await res.json();

//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <div className="home-page">
//       <h2>All Products</h2>
//       <div className="product-list">
//         {products.map((p) => (
//           <ProductCard
//             key={p._id}
//             product={{
//               _id: p._id,
//               name: p.name,
//               price: p.price,
//               image: p.image,
//             }}
//             onAddToCart={addToCart}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;

