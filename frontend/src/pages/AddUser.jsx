import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

const AddUser = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/admin/users", form);
      navigate("/admin/users");
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container py-5 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #647dee, #7f53ac)",
        minHeight: "100vh",
      }}
    >
      <div className="bg-white p-5 rounded shadow-lg col-md-6">
        <h3 className="text-center text-primary mb-4">
          <FaUserPlus className="me-2" />
          Add New User
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile</label>
            <input
              type="text"
              className="form-control"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="d-grid">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
