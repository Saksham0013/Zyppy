import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Address = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    pincode: "",
    state: "",
    city: "",
    landmark: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save full address object to localStorage
    localStorage.setItem("zyppyy-address", JSON.stringify(formData));

    // Go to checkout page
    navigate("/checkout");
  };

  return (
    <div className="address-container">
      <h2>Enter Delivery Details</h2>
      <form onSubmit={handleSubmit} className="address-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email (Gmail)"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          required
          value={formData.pincode}
          onChange={handleChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          required
          value={formData.state}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          required
          value={formData.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="landmark"
          placeholder="Landmark"
          value={formData.landmark}
          onChange={handleChange}
        />
        {/* <textarea
          name="address"
          placeholder="Full Address"
          required
          value={formData.address}
          onChange={handleChange}
        /> */}
        <button type="submit">Proceed to Payment</button>
      </form>
    </div>
  );
};

export default Address;
