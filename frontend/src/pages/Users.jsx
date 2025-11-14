import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaSearch, FaUser } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // For edit user
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // For add user
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    password: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);

  axios.defaults.withCredentials = true;

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data.users || res.data || []);
      setFiltered(res.data.users || res.data || []);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search Filter
  useEffect(() => {
    const result = users.filter(
      (u) =>
        u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.mobile?.includes(search)
    );
    setFiltered(result);
  }, [search, users]);

  // Handle edit click
  const handleEditClick = (user) => {
    setEditUser({ ...user });
    setShowEditModal(true);
  };

  // Handle edit form submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${editUser.id}`,
        editUser
      );
      toast.success("User updated successfully!");
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user!");
    }
  };

  // Handle add form submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/users", newUser);
      toast.success("User added successfully!");
      setShowAddModal(false);
      setNewUser({ first_name: "", last_name: "", mobile: "", password: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(
        error.response?.data?.error || "Failed to add user! Try again."
      );
    }
  };

  return (
    <div
      className="container py-5"
      style={{
        background: "linear-gradient(135deg, #647dee, #7f53ac)",
        minHeight: "80vh",
      }}
    >
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="bg-white p-4 rounded shadow-lg">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-primary mb-0">
            <FaUser className="me-2" /> Manage Users
          </h3>
          <button
            className="btn btn-success d-flex align-items-center"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus className="me-2" /> Add User
          </button>
        </div>

        {/* Search */}
        <div className="input-group mb-4">
          <span className="input-group-text bg-primary text-white">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-5 text-muted">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">No users found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Mobile</th>
                  <th>Joined On</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>
                        {user.first_name} {user.last_name}
                      </strong>
                    </td>
                    <td>{user.mobile}</td>
                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditClick(user)}
                      >
                        <FaEdit className="me-1" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={newUser.first_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, first_name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={newUser.last_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, last_name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="text"
                value={newUser.mobile}
                onChange={(e) =>
                  setNewUser({ ...newUser, mobile: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
                minLength={4}
                placeholder="Enter a secure password"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Add User
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={editUser?.first_name || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, first_name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={editUser?.last_name || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, last_name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="text"
                value={editUser?.mobile || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, mobile: e.target.value })
                }
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
