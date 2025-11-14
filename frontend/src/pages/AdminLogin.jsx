import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ mobile: "", password: "" });
  const [loading, setLoading] = useState(false);
  axios.defaults.withCredentials = true;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", form, {
        withCredentials: true,
      });

      // ✅ Save JWT token from backend
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      alert("✅ Admin login successful!");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "❌ Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        color: "white",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="d-flex flex-column flex-md-row shadow-lg rounded-4 overflow-hidden"
        style={{
          width: "90%",
          maxWidth: "950px",
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        {/* Left Side - Branding */}
        <div
          className="d-none d-md-flex flex-column justify-content-center align-items-center text-center p-5"
          style={{
            width: "50%",
            background: "linear-gradient(135deg, #576bdaea, #d3a173e0)",
            color: "white",
          }}
        >
          <h1 className="fw-bold display-5 mb-3">Admin Portal</h1>
          <p className="lead mb-4">Manage events, users, and reports with ease.</p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Admin illustration"
            style={{ width: "120px", opacity: 0.9 }}
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="p-5 bg-transparent flex-fill">
          <h2 className="text-center mb-4 fw-semibold">Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                className="form-control form-control-lg rounded-3"
                placeholder="Enter your mobile"
                value={form.mobile}
                onChange={handleChange}
                required
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "none",
                }}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control form-control-lg rounded-3"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "none",
                }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 rounded-3 shadow-sm"
              disabled={loading}
              style={{
                background: "linear-gradient(90deg, #2564ebee, #1e40af)",
                border: "none",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center">
            <Link to="/user/login" className="text-info text-decoration-none">
              User Login
            </Link>
          </p>
          <p className="text-center">
            Don’t have an account?{" "}
            <Link to="/admin/register" className="text-warning text-decoration-none">
              Register as Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
