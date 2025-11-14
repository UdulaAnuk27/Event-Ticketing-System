import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaMobileAlt,
  FaIdBadge,
  FaClock,
  FaUserTie,
  FaCogs,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/admin/dashboard");
        setAdmin(res.data.admin || res.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  return (
    <div
      className="container py-5 px-5"
      style={{
        background: "linear-gradient(135deg, #647dee, #7f53ac)",
        minHeight: "100vh",
      }}
    >
      <style>
        {`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeInUp 1s ease forwards; }
        .info-card {
          background: #fff;
          border-radius: 1rem;
          padding: 20px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.2);
        }
        .section-title {
          color: #fff;
          margin-bottom: 20px;
          font-weight: 600;
        }
        `}
      </style>

      {loading ? (
        <div className="text-center py-5 text-light">Loading admin data...</div>
      ) : admin ? (
        <>
          {/* Profile Header */}
          <div className="d-flex align-items-center justify-content-between fade-in mb-5 p-3 bg-white rounded-4 shadow">
            <div className="d-flex align-items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Admin Avatar"
                className="rounded-circle shadow"
                width="100"
                height="100"
                style={{ objectFit: "cover", marginRight: "15px" }}
              />
              <div>
                <h3 className="fw-bold mb-1">
                  {admin.first_name} {admin.last_name}
                </h3>
                <small className="text-muted">
                  Welcome back, Admin! 🚀 Manage your platform efficiently.
                </small>
              </div>
            </div>
            <div className="text-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/admin/manage-events")}
              >
                Manage Events
              </button>
            </div>
          </div>

          {/* Admin Info Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-3 col-6 fade-in">
              <div className="info-card text-center">
                <FaUserTie className="text-primary fs-3 mb-2" />
                <p className="mb-1 text-muted">Admin ID</p>
                <strong>{admin.id || "N/A"}</strong>
              </div>
            </div>
            <div className="col-md-3 col-6 fade-in">
              <div className="info-card text-center">
                <FaMobileAlt className="text-success fs-3 mb-2" />
                <p className="mb-1 text-muted">Mobile</p>
                <strong>{admin.mobile || "N/A"}</strong>
              </div>
            </div>
            <div className="col-md-3 col-6 fade-in">
              <div className="info-card text-center">
                <FaClock className="text-warning fs-3 mb-2" />
                <p className="mb-1 text-muted">Joined On</p>
                <strong>
                  {admin.created_at
                    ? new Date(admin.created_at).toLocaleDateString()
                    : "N/A"}
                </strong>
              </div>
            </div>
            <div className="col-md-3 col-6 fade-in">
              <div className="info-card text-center">
                <FaCogs className="text-danger fs-3 mb-2" />
                <p className="mb-1 text-muted">Role</p>
                <strong className="text-success">Administrator</strong>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <h4 className="section-title fade-in">⚙️ Quick Actions</h4>
          <div className="row g-4">
            <div className="col-md-4 fade-in">
              <div
                className="info-card text-center"
                onClick={() => navigate("/admin/manage-events")}
                style={{ cursor: "pointer" }}
              >
                <FaCogs className="fs-3 text-primary mb-2" />
                <h6>Manage Events</h6>
              </div>
            </div>
            <div className="col-md-4 fade-in">
              <div
                className="info-card text-center"
                onClick={() => navigate("/admin/users")}
                style={{ cursor: "pointer" }}
              >
                <FaUserTie className="fs-3 text-success mb-2" />
                <h6>View Users</h6>
              </div>
            </div>
            <div className="col-md-4 fade-in">
              <div
                className="info-card text-center"
                onClick={() => navigate("/admin/settings")}
                style={{ cursor: "pointer" }}
              >
                <FaCogs className="fs-3 text-warning mb-2" />
                <h6>Settings</h6>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-5 text-light">
            <p>✨ Empower your platform with smart administration tools!</p>
          </div>
        </>
      ) : (
        <p className="text-center text-light py-5">Admin data not found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
