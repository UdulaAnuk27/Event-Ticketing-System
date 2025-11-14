import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  InputGroup,
  ProgressBar,
} from "react-bootstrap";
import { FaLock, FaKey } from "react-icons/fa";

const AdminSetting = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength calculation
  const calculateStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    setPasswordStrength(score);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken"); // Admin token
      const res = await axios.put(
        "http://localhost:5000/api/admin/change-password",
        { oldPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength(0);
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      style={{
        padding: "8px",
        background: "linear-gradient(135deg, #647dee, #7f53ac)",
        minHeight: "81vh",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <Row className="justify-content-center">
        <Col md={6}>
          <Card
            className="shadow border-0 rounded-4 overflow-hidden"
            style={{ marginTop: "25px" }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #fc547bff, #fd593cff)",
                padding: "18px 0",
              }}
            >
              <h2
                className="text-center text-white mb-1"
                style={{ fontSize: "1.6rem" }}
              >
                🛡️ Admin Password
              </h2>
              <p
                className="text-center text-white-50 mb-0"
                style={{ fontSize: "0.85rem" }}
              >
                Protect your admin account by updating the password regularly.
              </p>
            </div>
            <Card.Body className="p-3">
              <Form onSubmit={handleChangePassword} className="px-1">
                <Form.Group className="mb-2">
                  <Form.Label className="small">Old Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Old password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label className="small">New Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaKey />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        calculateStrength(e.target.value);
                      }}
                      required
                    />
                  </InputGroup>
                  <ProgressBar
                    now={passwordStrength}
                    variant={
                      passwordStrength < 50
                        ? "danger"
                        : passwordStrength < 75
                        ? "warning"
                        : "success"
                    }
                    className="mt-1"
                    style={{ height: "5px", borderRadius: "3px" }}
                  />
                  <small className="text-muted">
                    Strength: {passwordStrength}%
                  </small>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label className="small">
                    Confirm New Password
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaKey />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Button
                  type="submit"
                  variant="danger"
                  className="w-100 py-2 fw-bold"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </Form>
              <p
                className="text-center text-muted mt-2 mb-0"
                style={{ fontSize: "0.75rem" }}
              >
                Tip: Use uppercase, numbers & special characters for security.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminSetting;
