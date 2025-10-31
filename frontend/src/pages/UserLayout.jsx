import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Dropdown, Nav, Button } from "react-bootstrap";
import {
  FaTachometerAlt,
  FaTicketAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaCreditCard,
  FaQrcode,
  FaRegCalendarAlt,
} from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState({ first_name: "User", last_name: "" });

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/user/login", { replace: true });
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.user) setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        localStorage.removeItem("token");
        navigate("/user/login", { replace: true });
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/user/logout",
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );

      localStorage.removeItem("token");
      navigate("/user/login", { replace: true }); // ✅ replaces current history entry
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
      localStorage.removeItem("token");
      navigate("/user/login", { replace: true });
    }
  };

  // Get initials (e.g., CN)
  const getInitials = (first, last) => {
    if (!first && !last) return "U";
    const firstInitial = first?.charAt(0)?.toUpperCase() || "";
    const lastInitial = last?.charAt(0)?.toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  const navItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: <FaTachometerAlt /> },
    { name: "Events", path: "/user/events", icon: <FaRegCalendarAlt  /> },
    { name: "My Tickets", path: "/user/my-tickets", icon: <FaTicketAlt /> },
    { name: "Payments", path: "/user/payments", icon: <FaCreditCard /> },
    { name: "My QR Codes", path: "/user/my-qr-codes", icon: <FaQrcode /> },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className={`bg-primary text-light d-flex flex-column p-3 shadow-lg ${sidebarCollapsed ? "collapsed-sidebar" : ""
          }`}
        style={{
          width: sidebarCollapsed ? "80px" : "250px",
          transition: "0.3s",
          overflowY: "auto",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-4 px-2">
          <h5 className="text-white fw-bold mb-0">
            {!sidebarCollapsed && "🎟️ Ticketing"}
          </h5>
          <Button
            variant="light"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="d-flex align-items-center justify-content-center"
          >
            <FaBars />
          </Button>
        </div>

        <Nav className="flex-column gap-2 flex-grow-1">
          {navItems.map((item) => (
            <Nav.Item key={item.name}>
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center rounded px-3 py-2 ${location.pathname === item.path
                  ? "bg-warning text-dark fw-bold"
                  : "text-light"
                  }`}
                style={{ transition: "0.3s" }}
              >
                <span className="me-2">{item.icon}</span>
                {!sidebarCollapsed && item.name}
              </Link>
            </Nav.Item>
          ))}
        </Nav>

        {/* Sidebar Footer */}
        <div
          className="text-center mt-auto pt-3 border-top border-light"
          style={{
            fontSize: "0.85rem",
            opacity: 0.9,
          }}
        >
          {!sidebarCollapsed && (
            <div>© {new Date().getFullYear()} Event Ticketing System</div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 bg-light d-flex flex-column">
        {/* Header Navbar */}
        <nav
          className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 d-flex justify-content-between"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <span className="navbar-brand fw-bold fs-4">User Panel</span>

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              id="dropdown-user"
              className="d-flex align-items-center border-0 bg-white"
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#0d6efd22",
                  color: "#0d6efd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                }}
              >
                {getInitials(user.first_name, user.last_name)}
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu
              style={{
                minWidth: "220px",
                padding: "10px 0",
              }}
            >
              <Dropdown.ItemText>
                <div>Signed in as</div>
                <div>
                  <strong>
                    {user.first_name} {user.last_name}
                  </strong>
                </div>
              </Dropdown.ItemText>
              <Dropdown.Divider />
              <Dropdown.Item as={Link} to="/user/profile">
                <FaCog className="me-2" /> Profile
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/user/settings">
                <FaCog className="me-2" /> Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                <FaSignOutAlt className="me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </nav>

        {/* Main Scrollable Content */}
        <div
          className="p-4"
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
