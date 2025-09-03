import React, { useState } from "react";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axiosInstance.post("/api/auth/login", { email, password });

      if (!res.data.token || !res.data.user) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("zyppyy-token", res.data.token);
      localStorage.setItem("zyppyy-user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin" || res.data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.response?.data?.message || "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {/* ✅ Inline error message */}
        {errorMsg && <p style={{ color: "red", fontSize: "14px" }}>{errorMsg}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <div style={{ position: "relative" }} className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
