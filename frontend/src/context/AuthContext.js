import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem("zyppyy-user");
    return localUser ? JSON.parse(localUser) : null;
  });

  const login = (userData) => {
    localStorage.setItem("zyppyy-user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("zyppyy-user");
    setUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("zyppyy-user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const getUserProfile = async () => {
  const storedUser = JSON.parse(localStorage.getItem("zyppyy-user"));
  const token = storedUser?.token;

  if (!token) throw new Error("No token found");

  const res = await fetch("https://zyppy.onrender.comhttps://zyppy.onrender.com/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch profile");

  return await res.json();
};

export { getUserProfile };
export default AuthProvider;
