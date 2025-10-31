import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ mobile: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/user/login", form);
      localStorage.setItem("token", res.data.token);
      alert("✅ User login successful!");
      navigate("/user/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #3b82f6, #9333ea, #14b8a6, #f59e0b)",
        backgroundSize: "400% 400%",
        animation: "gradientFlow 8s ease infinite",
        color: "white",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <style>
        {`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        `}
      </style>

      <div
        className="d-flex flex-column flex-md-row shadow-lg rounded-4 overflow-hidden"
        style={{
          width: "90%",
          maxWidth: "950px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          boxShadow: "0 0 25px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Left Section – Illustration & Tagline */}
        <div
          className="d-none d-md-flex flex-column justify-content-center align-items-center text-center p-5"
          style={{
            width: "50%",
            background:
              "linear-gradient(135deg, #06b6d4, #3b82f6, #9333ea)",
            color: "white",
            boxShadow: "inset 0 0 20px rgba(255,255,255,0.2)",
          }}
        >
          <h1 className="fw-bold display-6 mb-3 text-shadow">Welcome Back 🎉</h1>
          <p className="lead mb-4" style={{ opacity: 0.9 }}>
            Your events, your tickets, your world — all in one place.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
            alt="User illustration"
            style={{
              width: "130px",
              filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))",
            }}
          />
        </div>

        {/* Right Section – Login Form */}
        <div className="p-5 flex-fill bg-transparent">
          <h2
            className="text-center mb-4 fw-bold"
            style={{
              textShadow: "0 0 10px rgba(255,255,255,0.3)",
              letterSpacing: "0.5px",
            }}
          >
            User Login
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-light">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                className="form-control form-control-lg rounded-3"
                placeholder="Enter your mobile"
                value={form.mobile}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit mobile number"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                  fontFamily: "sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 12px #3b82f6";
                  e.target.style.background = "rgba(255,255,255,0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255,255,255,0.2)";
                }}
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-light">Password</label>
              <input
                type="password"
                name="password"
                className="form-control form-control-lg rounded-3"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={4}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                  fontFamily: "sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 12px #9333ea";
                  e.target.style.background = "rgba(255,255,255,0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255,255,255,0.2)";
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-lg w-100 fw-bold rounded-3"
              disabled={loading}
              style={{
                background:
                  "linear-gradient(90deg, #facc15, #f97316, #ef4444)",
                color: "#fff",
                border: "none",
                transition: "all 0.3s ease",
                boxShadow: "0 0 12px rgba(249, 115, 22, 0.5)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(249, 115, 22, 0.8)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 0 12px rgba(249, 115, 22, 0.5)";
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center">
            <Link
              to="/admin/login"
              className="text-warning text-decoration-none"
            >
              Admin Login
            </Link>
          </p>
          <p className="text-center">
            Don’t have an account?{" "}
            <Link
              to="/user/register"
              className="text-info text-decoration-none"
            >
              Register as User
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
