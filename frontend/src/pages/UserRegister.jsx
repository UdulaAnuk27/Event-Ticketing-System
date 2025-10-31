import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/user/register", form);
      alert(res.data.message || "User registered successfully!");
      setForm({ first_name: "", last_name: "", mobile: "", password: "" });
      navigate("/user/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #f43f5e, #ec4899, #8b5cf6, #3b82f6)",
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
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 0 25px rgba(0,0,0,0.3)",
        }}
      >
        <div className="text-center mb-4">
          <h2
            className="fw-bold mb-2"
            style={{ textShadow: "0 0 8px rgba(255,255,255,0.4)" }}
          >
            Create Account
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)" }}>
            Join TicketZone and explore amazing events!
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
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                  fontFamily: "sans-serif", 
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 12px #f43f5e";
                  e.target.style.background = "rgba(255,255,255,0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255,255,255,0.2)";
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
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                  fontFamily: "sans-serif", 
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 12px #ec4899";
                  e.target.style.background = "rgba(255,255,255,0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "rgba(255,255,255,0.2)";
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
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              transition: "all 0.3s ease",
              fontFamily: "sans-serif", 
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = "0 0 12px #8b5cf6";
              e.target.style.background = "rgba(255,255,255,0.3)";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.background = "rgba(255,255,255,0.2)";
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-lg w-100 fw-bold rounded-3"
            style={{
              background: "linear-gradient(90deg, #facc15, #f472b6, #9333ea)",
              color: "#fff",
              border: "none",
              boxShadow: "0 0 15px rgba(249, 115, 22, 0.6)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(249, 115, 22, 0.9)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(249, 115, 22, 0.6)";
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/user/login" className="text-info text-decoration-none">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
