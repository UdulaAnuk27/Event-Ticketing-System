import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Spinner,
  Image,
} from "react-bootstrap";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

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
      <div className="d-flex justify-content-center align-items-center vh-100 text-primary">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading profile...</span>
      </div>
    );

  if (!user)
    return <p className="text-danger text-center mt-5">User data not found.</p>;

  const redOutline = {
    border: "2px solid red",
    boxShadow: "0 0 4px rgba(255, 0, 0, 0.5)",
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center py-5"
      style={{
        minHeight: "84.3vh",
        background:
          "linear-gradient(135deg, #4d5e6ead 0%, #a75f0d8a 100%)",
      }}
    >
      <Card
        className="shadow-lg border-0 overflow-hidden"
        style={{
          width: "90%",
          maxWidth: "1000px",
          borderRadius: "20px",
          background: "#ffffffcc",
        }}
      >
        <Row className="g-0">
          {/* LEFT SIDE */}
          <Col
            md={4}
            className="text-center text-white d-flex flex-column align-items-center justify-content-center p-4"
            style={{
              background:
                "linear-gradient(160deg, #3639a1ff 0%, #1BFFFF 100%)",
            }}
          >
            <div className="position-relative mb-3">
              <Image
                src={editableUser.profile_image}
                roundedCircle
                width="160"
                height="160"
                className="border border-3 border-white shadow-lg"
              />
              {editing && (
                <Form.Label
                  htmlFor="upload"
                  className="position-absolute bottom-0 end-0 bg-white rounded-circle p-2 shadow-sm"
                  style={{ cursor: "pointer" }}
                >
                  <FaEdit color="#007bff" />
                  <Form.Control
                    id="upload"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Form.Label>
              )}
            </div>
            <h4 className="fw-bold mb-0">
              {editableUser.first_name} {editableUser.last_name}
            </h4>
            <small>{editableUser.email}</small>
            <div
              className="mt-3 px-3 py-2 rounded-3"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                fontSize: "0.9rem",
              }}
            >
              Mobile: {editableUser.mobile}
            </div>
          </Col>

          {/* RIGHT SIDE */}
          <Col md={8} className="p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-primary mb-0">Profile Details</h4>
              {!editing ? (
                <Button variant="outline-primary" onClick={handleEditClick}>
                  <FaEdit className="me-1" /> Edit
                </Button>
              ) : (
                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" onClick={handleCancelClick}>
                    <FaTimes className="me-1" /> Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
                    <FaSave className="me-1" /> Save
                  </Button>
                </div>
              )}
            </div>

            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={editableUser.first_name}
                      onChange={handleChange}
                      readOnly={!editing}
                      placeholder="Enter first name"
                      style={
                        missingFields.includes("first_name") ? redOutline : {}
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={editableUser.last_name}
                      onChange={handleChange}
                      readOnly={!editing}
                      placeholder="Enter last name"
                      style={
                        missingFields.includes("last_name") ? redOutline : {}
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={editableUser.email}
                      onChange={handleChange}
                      readOnly={!editing}
                      placeholder="Enter email"
                      style={missingFields.includes("email") ? redOutline : {}}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control
                      type="text"
                      name="mobile"
                      value={editableUser.mobile}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group>
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
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={editableUser.address}
                      onChange={handleChange}
                      readOnly={!editing}
                      placeholder="Enter address"
                      style={
                        missingFields.includes("address") ? redOutline : {}
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Profile;
