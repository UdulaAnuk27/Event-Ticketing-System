import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./AdminLayout.css";
import { FaTachometerAlt, FaCar, FaTags, FaUsers, FaClipboardList } from "react-icons/fa";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>ADMIN PANEL</h2>
        <nav>
          <ul>
            <li>
              <Link to="/admin/dashboard">
                <FaTachometerAlt /> <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/vehicles">
                <FaCar /> <span>Vehicles</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/brands">
                <FaTags /> <span>Brands</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/users">
                <FaUsers /> <span>Users</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/orders">
                <FaClipboardList /> <span>Orders</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
