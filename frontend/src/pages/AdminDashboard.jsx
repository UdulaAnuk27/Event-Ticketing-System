import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Enable cookie-based authentication
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // optional if cookie used
        const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        // Backend may return { admin } or direct object
        setAdmin(res.data.admin || res.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        navigate("/admin/login"); // redirect if not authorized
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <span className="navbar-brand fw-bold fs-4">🛠️ Admin Panel</span>
          <button className="btn btn-outline-light fw-semibold" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Dashboard */}
      <div className="container my-5 flex-grow-1">
        <div
          className="card shadow-lg border-0 rounded-4 p-4 mx-auto"
          style={{ maxWidth: "600px" }}
        >
          <div className="card-body text-center">
            <h3 className="fw-bold text-dark mb-4">Welcome to Admin Dashboard</h3>

            {loading ? (
              <div className="text-muted">Loading admin data...</div>
            ) : admin ? (
              <>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Admin Avatar"
                  className="rounded-circle mb-3 border border-3 border-dark"
                  width="100"
                  height="100"
                />
                <h4 className="fw-semibold text-dark">{admin?.name || "Admin"}</h4>
                <p className="text-muted mb-1">
                  📱 Mobile: <strong>{admin?.mobile || "N/A"}</strong>
                </p>
                <p className="text-muted mb-3">
                  🆔 Admin ID: <strong>{admin?.id || "N/A"}</strong>
                </p>

                <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                  <button
                    className="btn btn-outline-primary px-4 mb-2"
                    onClick={() => navigate("/admin/users")}
                  >
                    👥 Manage Users
                  </button>
                  <button
                    className="btn btn-outline-secondary px-4 mb-2"
                    onClick={() => navigate("/admin/settings")}
                  >
                    ⚙️ Account Settings
                  </button>
                </div>
              </>
            ) : (
              <p className="text-danger">Admin data not found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3 mt-auto shadow-sm">
        <small>
          © {new Date().getFullYear()} Event Ticketing Admin — All Rights Reserved.
        </small>
      </footer>
    </div>
  );
};

export default AdminDashboard;
