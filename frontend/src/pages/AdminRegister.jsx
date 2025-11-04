import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminRegister = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/admin/register", form);
      alert(res.data.message || "Admin registered successfully!");
      setForm({ first_name: "", last_name: "", mobile: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #0f172a, #1e293b, #334155, #475569)",
        backgroundSize: "400% 400%",
        animation: "gradientFlow 8s ease infinite",
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
        className="card shadow-lg p-4 rounded-4"
        style={{
          maxWidth: "600px",
          width: "100%",
          backdropFilter: "blur(14px)",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 0 25px rgba(0,0,0,0.4)",
          color: "white",
        }}
      >
        <div className="text-center mb-4">
          <h2
            className="fw-bold mb-2"
            style={{ textShadow: "0 0 8px rgba(255,255,255,0.4)" }}
          >
            Admin Registration
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Secure access for TicketZone administrators
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <input
                type="text"
                name="first_name"
                className="form-control form-control-lg rounded-3 mb-3"
                placeholder="First Name"
                value={form.first_name}
                onChange={handleChange}
                required
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.25)",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 10px #06b6d4";
                  e.target.style.background = "rgba(255,255,255,0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255,255,255,0.15)";
                }}
              />
            </div>
            <div className="col">
              <input
                type="text"
                name="last_name"
                className="form-control form-control-lg rounded-3 mb-3"
                placeholder="Last Name"
                value={form.last_name}
                onChange={handleChange}
                required
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.25)",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 10px #3b82f6";
                  e.target.style.background = "rgba(255,255,255,0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255,255,255,0.15)";
                }}
              />
            </div>
          </div>

          <input
            type="text"
            name="mobile"
            className="form-control form-control-lg rounded-3 mb-3"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            required
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.25)",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = "0 0 10px #10b981";
              e.target.style.background = "rgba(255,255,255,0.25)";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.background = "rgba(255,255,255,0.15)";
            }}
          />

          <input
            type="password"
            name="password"
            className="form-control form-control-lg rounded-3 mb-4"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.25)",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = "0 0 10px #f59e0b";
              e.target.style.background = "rgba(255,255,255,0.25)";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.background = "rgba(255,255,255,0.15)";
            }}
          />

          {error && (
            <div
              className="text-center mb-3 py-2 rounded-3"
              style={{
                background: "rgba(255, 0, 0, 0.2)",
                color: "#ffb3b3",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-lg w-100 fw-bold rounded-3"
            style={{
              background: "linear-gradient(90deg, #06b6d4, #3b82f6, #10b981)",
              color: "#fff",
              border: "none",
              boxShadow: "0 0 20px rgba(59,130,246,0.6)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(59,130,246,0.9)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(59,130,246,0.6)";
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="mt-4 text-center" style={{ color: "rgba(255,255,255,0.8)" }}>
          Already have an account?{" "}
          <Link to="/admin/login" className="text-info text-decoration-none">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
