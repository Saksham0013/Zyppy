export const getCart = () => {
  return JSON.parse(localStorage.getItem("zyppyy-cart")) || [];
};

export const addToCart = (product) => {
  const storedCart = getCart();

  const existingItemIndex = storedCart.findIndex(
    (item) => item._id === product._id
  );

  if (existingItemIndex !== -1) {
    storedCart[existingItemIndex].quantity += 1;
  } else {
    storedCart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("zyppyy-cart", JSON.stringify(storedCart));
};
