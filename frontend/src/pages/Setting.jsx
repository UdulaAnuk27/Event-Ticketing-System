import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Spinner,
  Nav,
  ListGroup,
} from "react-bootstrap";
import {
  FaUserCircle,
  FaLock,
  FaCog,
  FaImage,
  FaRegAddressCard,
} from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [missingFields, setMissingFields] = useState([]);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/user-details", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const u = res.data.user;
        const userData = {
          id: u.id,
          first_name: u.first_name || u.details?.first_name || "",
          last_name: u.last_name || u.details?.last_name || "",
          mobile: u.mobile,
          email: u.details?.email || "",
          profile_image:
            u.details?.profile_image ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          date_of_birth: u.details?.date_of_birth || "",
          address: u.details?.address || "",
        };

        setUser(userData);
        setEditableUser(userData);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEditClick = () => setEditing(true);
  const handleCancelClick = () => {
    setEditableUser(user);
    setSelectedImage(null);
    setEditing(false);
    setMissingFields([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
    if (value.trim()) {
      setMissingFields((prev) => prev.filter((field) => field !== name));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setEditableUser({
        ...editableUser,
        profile_image: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = async () => {
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "date_of_birth",
      "address",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !editableUser[field]?.trim()
    );

    if (emptyFields.length > 0) {
      setMissingFields(emptyFields);
      return alert("Please fill in all required fields!");
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("first_name", editableUser.first_name);
      formData.append("last_name", editableUser.last_name);
      formData.append("email", editableUser.email);
      formData.append("date_of_birth", editableUser.date_of_birth);
      formData.append("address", editableUser.address);

      if (selectedImage) formData.append("profile_image", selectedImage);

      const res = await axios.put(
        "http://localhost:5000/api/user-details/update",
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = {
        ...editableUser,
        profile_image:
          res.data.details?.profile_image || editableUser.profile_image,
      };

      setUser(updatedUser);
      setEditableUser(updatedUser);
      setEditing(false);
      setSelectedImage(null);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Error updating profile!");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading settings...</span>
      </div>
    );

  if (!user)
    return <p className="text-danger text-center mt-5">User data not found.</p>;

  const redOutline = {
    border: "2px solid red",
    boxShadow: "0 0 4px rgba(255, 0, 0, 0.5)",
  };

  return (
    <div className="container-fluid mt-4">
      <Row>
        {/* ===== Left Settings Sidebar ===== */}
        <Col md={3} className="mb-3">
          <Card className="shadow-sm rounded-4 border-0 p-3">
            <div className="text-center mb-3">
              <img
                src={editableUser.profile_image}
                alt="Profile"
                className="rounded-circle border border-3 border-primary"
                width="120"
                height="120"
              />
              <h5 className="fw-bold mt-3">
                {editableUser.first_name} {editableUser.last_name}
              </h5>
              <p className="text-muted">{editableUser.email}</p>

              {editing && (
                <Form.Group controlId="upload" className="mt-2">
                  <Form.Label className="btn btn-outline-primary btn-sm w-75">
                    <FaImage className="me-2" /> Upload
                    <Form.Control
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </Form.Label>
                </Form.Group>
              )}
            </div>

            <ListGroup variant="flush">
              <ListGroup.Item action active className="border-0 rounded-3 mb-2">
                <FaUserCircle className="me-2" /> Profile Settings
              </ListGroup.Item>
              <ListGroup.Item action className="border-0 mb-2">
                <FaLock className="me-2" /> Password & Security
              </ListGroup.Item>
              <ListGroup.Item action className="border-0 mb-2">
                <FaRegAddressCard className="me-2" /> Personal Info
              </ListGroup.Item>
              <ListGroup.Item action className="border-0">
                <FaCog className="me-2" /> Account Preferences
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        {/* ===== Right Settings Content ===== */}
        <Col md={9}>
          <Card className="shadow-sm rounded-4 border-0 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1">Site Settings</h4>
                <p className="text-muted mb-0">
                  Manage your account information and preferences.
                </p>
              </div>
              {!editing ? (
                <Button variant="primary" onClick={handleEditClick}>
                  Edit Profile
                </Button>
              ) : (
                <div className="d-flex gap-2">
                  <Button variant="secondary" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                  <Button variant="success" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <hr />

            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={editableUser.first_name}
                    onChange={handleChange}
                    readOnly={!editing}
                    style={
                      missingFields.includes("first_name") ? redOutline : {}
                    }
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={editableUser.last_name}
                    onChange={handleChange}
                    readOnly={!editing}
                    style={missingFields.includes("last_name") ? redOutline : {}}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editableUser.email}
                    onChange={handleChange}
                    readOnly={!editing}
                    style={missingFields.includes("email") ? redOutline : {}}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    value={editableUser.mobile}
                    readOnly
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_of_birth"
                    value={editableUser.date_of_birth}
                    onChange={handleChange}
                    readOnly={!editing}
                    style={
                      missingFields.includes("date_of_birth")
                        ? redOutline
                        : {}
                    }
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={editableUser.address}
                    onChange={handleChange}
                    readOnly={!editing}
                    style={missingFields.includes("address") ? redOutline : {}}
                  />
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
