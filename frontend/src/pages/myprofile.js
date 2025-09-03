import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("zyppyy-user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    if (!user) return <p>Loading user...</p>;

    return (
        <div className="profile-container">
            <h2>My Profile</h2>
            <div className="profile-card">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user._id}</p>
                <p><strong>Role:</strong> {user.role || "user"}</p>

                <div className="profile-actions">
                    {user.role === "admin" && (
                        <button className=".profile-btn" onClick={() => navigate("/admin")}>
                            Go to Admin Dashboard
                        </button>
                    )}
                    <button className=".profile-btn"
                        onClick={() => {
                            localStorage.removeItem("zyppyy-token");
                            localStorage.removeItem("zyppyy-user");
                            navigate("/login");
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
