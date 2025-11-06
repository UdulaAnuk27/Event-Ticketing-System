import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please login.");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.admin) setAdmin(res.data.admin);
        else setError("Admin details not found.");
      } catch (err) {
        console.error("Failed to fetch admin details:", err);
        setError("Failed to fetch admin details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (loading) return <p className="text-center py-5">Loading admin details...</p>;
  if (error) return <p className="text-center py-5 text-danger">{error}</p>;

  return (
    <div className="container py-5">
      <h2>📌 Admin Dashboard</h2>
      <div className="bg-white p-4 rounded shadow mt-4">
        <p><strong>ID:</strong> {admin?.id}</p>
        <p><strong>Name:</strong> {admin?.first_name} {admin?.last_name}</p>
        <p><strong>Mobile:</strong> {admin?.mobile}</p>
        <p><strong>Joined On:</strong> {admin?.created_at ? new Date(admin.created_at).toLocaleDateString() : "N/A"}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
