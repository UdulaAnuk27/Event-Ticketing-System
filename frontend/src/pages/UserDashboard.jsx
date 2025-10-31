import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMobileAlt, FaIdBadge, FaClock } from "react-icons/fa";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const dashboardRes = await axios.get(
          "http://localhost:5000/api/user/dashboard",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        const dashboardData = dashboardRes.data.user || dashboardRes.data;

        const profileRes = await axios.get(
          "http://localhost:5000/api/user-details",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        const profileData = profileRes.data.user || profileRes.data;
        const profileImage =
          profileData.details?.profile_image ||
          profileData.profile_image ||
          "https://cdn-icons-png.flaticon.com/512/847/847969.png";

        setUser({ ...dashboardData, profile_image: profileImage });
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow-lg border-0 rounded-4 p-4 text-center"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <h3 className="fw-bold text-primary mb-4">
          Welcome to Your Dashboard
        </h3>

        {loading ? (
          <div className="text-muted">Loading user data...</div>
        ) : user ? (
          <>
            {/* Profile Image */}
            <div className="d-flex justify-content-center mb-3">
              <img
                src={user.profile_image}
                alt="User Avatar"
                className="rounded-circle border border-3 border-primary shadow-sm"
                width="130"
                height="130"
                style={{ objectFit: "cover", backgroundColor: "#f8f9fa" }}
              />
            </div>

            <h4 className="fw-semibold text-dark mb-3">
              Mr. {user.first_name} {user.last_name}
            </h4>

            <p className="text-muted mb-2">
              <FaMobileAlt className="me-2 text-primary" />
              Mobile: <strong>{user.mobile || "N/A"}</strong>
            </p>
            <p className="text-muted mb-2">
              <FaIdBadge className="me-2 text-primary" />
              User ID: <strong>{user.id || "N/A"}</strong>
            </p>
            <p className="text-muted">
              <FaClock className="me-2 text-primary" />
              Joined on:{" "}
              <strong>
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "N/A"}
              </strong>
            </p>
          </>
        ) : (
          <p className="text-danger">User data not found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
