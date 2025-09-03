import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem("zyppyy-token");
    const user = JSON.parse(localStorage.getItem("zyppyy-user"));

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/profile" replace />;
    }

    return children;
};

export default ProtectedRoute;
