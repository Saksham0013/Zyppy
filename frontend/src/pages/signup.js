import React, { useState } from "react";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            const res = await axiosInstance.post("/api/auth/register", formData);

            if (res.data?.token && res.data?.user) {
                localStorage.setItem("zyppyy-token", res.data.token);
                localStorage.setItem("zyppyy-user", JSON.stringify(res.data.user));

                if (res.data.user.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/profile");
                }
            } else {
                navigate("/login");
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Something went wrong, please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>

                {errorMsg && <p style={{ color: "red", fontSize: "14px" }}>{errorMsg}</p>}

                <input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <div className="password-field">
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer", marginLeft: "-30px" }}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </span>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Account"}
                </button>
                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
        </div>
    );
};

export default Signup;
