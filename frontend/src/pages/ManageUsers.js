import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const { user, token } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get("https://zyppy.onrender.com/api/users", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("zyppyy-token")}` },
                });
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error.response?.data || error.message);
            }
        };

        if (user?.role === "admin" || user?.isSuperAdmin) {
            fetchUsers();
        }
    }, [user, token]);

    const changeRole = async (userId, newRole) => {
        try {
            const { data } = await axios.put(
                `https://zyppy.onrender.com/api/users/${userId}/role`,
                { role: newRole },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("zyppyy-token")}` },
                }
            );

            setUsers((prev) =>
                prev.map((u) => (u._id === userId ? { ...u, role: data.role } : u))
            );
        } catch (error) {
            console.error("Error changing role:", error.response?.data || error.message);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`https://zyppy.onrender.com/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("zyppyy-token")}` },
            });
            setUsers((prev) => prev.filter((u) => u._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error.response?.data || error.message);
        }
    };

    return (
        <div className="page-container">
            <h2>👥 Manage Users</h2>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul>
                    {users.map((u) => (
                        <li key={u._id}>
                            <strong>{u.name}</strong> - {u.role}{" "}
                            {u.isSuperAdmin ? (
                                <span> 🔒 Super Admin</span>
                            ) : (
                                <>
                                    <button
                                        onClick={() =>
                                            changeRole(u._id, u.role === "user" ? "admin" : "user")
                                        }
                                    >
                                        Change Role
                                    </button>{" "}
                                    <button onClick={() => deleteUser(u._id)}>Delete</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManageUsers;
