import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaMobileAlt,
  FaIdBadge,
  FaClock,
  FaUserAlt,
  FaTicketAlt,
} from "react-icons/fa";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const dashboardRes = await axios.get(
          "http://localhost:5000/api/user/dashboard",
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        const dashboardData = dashboardRes.data.user || dashboardRes.data;

        const profileRes = await axios.get(
          "http://localhost:5000/api/user-details",
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
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

  // Fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      setTicketsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/tickets/my-tickets", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setTickets(response.data || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setTicketsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div
      className="container py-5 px-5"
      style={{
        background: "linear-gradient(135deg, #83cdebff, #5490f7ff)",
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
        .ticket-card {
          background: #fff;
          border-radius: 1rem;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        .ticket-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        `}
      </style>

      {loading ? (
        <div className="text-center py-5 text-light">Loading user data...</div>
      ) : user ? (
        <>
          {/* Profile Header */}
          <div className="d-flex align-items-center justify-content-between fade-in mb-5 p-3 bg-white rounded-4 shadow">
            <div className="d-flex align-items-center">
              <img
                src={user.profile_image}
                alt="User Avatar"
                className="rounded-circle shadow"
                width="100"
                height="100"
                style={{ objectFit: "cover", marginRight: "15px" }}
              />
              <div>
                <h3 className="fw-bold mb-1">
                  {user.first_name} {user.last_name}
                </h3>
                <small className="text-muted">
                  Welcome back! Ready for your next event? 🎉
                </small>
              </div>
            </div>
            <div className="text-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/user/events")}
              >
                Book New Ticket
              </button>
            </div>
          </div>

          {/* User Info Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-3 col-6 fade-in">
              <div className="info-card text-center">
                <FaMobileAlt className="text-primary fs-3 mb-2" />
                <p className="mb-1 text-muted">Mobile</p>
                <strong>{user.mobile || "N/A"}</strong>
              </div>
            </div>
            <div className="col-md-3 col-6 fade-in">
              <div className="info-card text-center">
                <FaIdBadge className="text-success fs-3 mb-2" />
                <p className="mb-1 text-muted">User ID</p>
                <strong>{user.id || "N/A"}</strong>
              </div>
            </div>
            <div className="col-md-3 col-6 fade-in">
              <div className="info-card text-center">
                <FaClock className="text-warning fs-3 mb-2" />
                <p className="mb-1 text-muted">Joined On</p>
                <strong>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "N/A"}
                </strong>
              </div>
            </div>
            <div className="col-md-3 col-6 fade-in">
              <div className="info-card text-center">
                <FaUserAlt className="text-danger fs-3 mb-2" />
                <p className="mb-1 text-muted">Status</p>
                <strong className="text-success">Active</strong>
              </div>
            </div>
          </div>

          {/* Tickets Section */}
          <h4 className="section-title fade-in">🎫 Your Tickets</h4>

          {ticketsLoading ? (
            <div className="text-light">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-light">No tickets found.</div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card fade-in">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold mb-1">{ticket.event_title || "Unnamed Event"}</h5>
                    <small className="text-muted">
                      {ticket.venue || "Location not specified"}
                    </small>
                    <br />
                    <small className="text-muted">
                      {new Date(ticket.created_at).toLocaleString()}
                    </small>
                  </div>
                  <div className="text-end">
                    <span
                      className={`badge ${
                        ticket.status === "Paid"
                          ? "bg-success"
                          : ticket.status === "Pending"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {ticket.status || "Paid"}
                    </span>
                    <br />
                    <button
                      className="btn btn-outline-primary btn-sm mt-2"
                      onClick={() => navigate("/user/my-tickets")}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Footer */}
          <div className="text-center mt-5 text-light">
            <p>✨ Explore, book, and enjoy your favorite events with ease!</p>
          </div>
        </>
      ) : (
        <p className="text-center text-light py-5">User data not found.</p>
      )}
    </div>
  );
};

export default UserDashboard;
