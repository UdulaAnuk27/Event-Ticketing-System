import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Dropdown, Nav, Button } from "react-bootstrap";
import { FaTachometerAlt, FaUsers, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getInitials = (first, last) => {
    const fi = first?.charAt(0)?.toUpperCase() || "";
    const li = last?.charAt(0)?.toUpperCase() || "";
    return fi + li;
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/admin/logout",
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {}, withCredentials: true }
      );
      localStorage.removeItem("token");
      navigate("/admin/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.removeItem("token");
      navigate("/admin/login", { replace: true });
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className={`bg-dark text-light d-flex flex-column p-3 shadow-lg ${sidebarCollapsed ? "collapsed-sidebar" : ""}`}
        style={{
          width: sidebarCollapsed ? "80px" : "250px",
          transition: "0.3s",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-4 px-2">
          <h5 className="text-white fw-bold mb-0">{!sidebarCollapsed && "Admin Panel"}</h5>
          <Button variant="light" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <FaBars />
          </Button>
        </div>

        <Nav className="flex-column gap-2 flex-grow-1">
          {navItems.map((item) => (
            <Nav.Item key={item.name}>
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center rounded px-3 py-2 ${
                  location.pathname === item.path ? "bg-warning text-dark fw-bold" : "text-light"
                }`}
              >
                <span className="me-2">{item.icon}</span>
                {!sidebarCollapsed && item.name}
              </Link>
            </Nav.Item>
          ))}
        </Nav>

        {/* Footer */}
        <div className="text-center mt-auto pt-3 border-top border-light" style={{ fontSize: "0.85rem", opacity: 0.8 }}>
          {!sidebarCollapsed && <div>© {new Date().getFullYear()} Event Ticketing</div>}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light d-flex flex-column">
        {/* Header */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 d-flex justify-content-between" style={{ position: "sticky", top: 0, zIndex: 1000 }}>
          <span className="navbar-brand fw-bold fs-4">Admin Panel</span>

          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-admin" className="d-flex align-items-center border-0 bg-white">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#ffc10722",
                  color: "#ffc107",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                }}
              >
                AD
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ minWidth: "220px", padding: "10px 0" }}>
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                <FaSignOutAlt className="me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </nav>

        <div className="p-4 flex-1" style={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
