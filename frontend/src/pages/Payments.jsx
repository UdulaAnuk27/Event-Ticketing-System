import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Card, Modal } from "react-bootstrap";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "N/A",
    mobile: "N/A",
    email: "N/A",
  });

  // ✅ Fetch user info + payments together
  useEffect(() => {
    const fetchPaymentsAndUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch in parallel
        const [dashboardRes, detailsRes, bookingsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/user/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/user-details", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/bookings/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // 🧍 Combine user info
        const dashboardData = dashboardRes.data.user || dashboardRes.data;
        const detailsData = detailsRes.data.user?.details || {};

        setUserInfo({
          name: `${dashboardData.first_name || ""} ${
            dashboardData.last_name || ""
          }`.trim(),
          mobile: dashboardData.mobile || "N/A",
          email: detailsData.email || "N/A",
        });

        // 💳 Extract payment info from bookings
        const mappedPayments = bookingsRes.data.map((b) => ({
          id: b.id || b.booking_id,
          event_title: b.event?.title || "N/A",
          tickets_count: b.tickets_count || 0,
          total_price: b.total_price || 0,
          payment_status: b.payment_status || "Paid",
          payment_method: b.payment_method || "Card",
          created_at: b.created_at || b.booking_date || null,
        }));

        setPayments(mappedPayments);
      } catch (err) {
        console.error("Error fetching payments:", err);
        alert("Failed to fetch payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentsAndUser();
  }, []);

  // 🔍 View Payment Details
  const handleView = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedPayment(null);
    setShowModal(false);
  };

  return (
    <div style={{ padding: "20px", minHeight: "81vh", background: "#9ecbe0ff" }}>
      <h3 className="mb-4 text-primary">💳 My Payments</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Table
              striped
              hover
              responsive
              className="align-middle text-center mb-0"
              style={{ borderRadius: "12px", overflow: "hidden" }}
            >
              <thead className="bg-primary text-white">
                <tr>
                  <th>Booking ID</th>
                  <th>Event</th>
                  <th>Tickets</th>
                  <th>Amount (Rs.)</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>{payment.event_title}</td>
                      <td>{payment.tickets_count}</td>
                      <td>Rs. {payment.total_price}</td>
                      <td>{payment.payment_method}</td>
                      <td>
                        <span
                          className={`badge ${
                            payment.payment_status === "Paid" ||
                            payment.payment_status === "Success"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {payment.payment_status}
                        </span>
                      </td>
                      <td>
                        {payment.created_at
                          ? new Date(payment.created_at).toLocaleString("en-GB")
                          : "N/A"}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => handleView(payment)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* 🧾 Payment Details Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>🧾 Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <div style={{ lineHeight: "1.8" }}>
              <p>
                <strong>Booking ID:</strong> {selectedPayment.id}
              </p>
              <p>
                <strong>Event:</strong> {selectedPayment.event_title}
              </p>
              <p>
                <strong>Tickets:</strong> {selectedPayment.tickets_count}
              </p>
              <p>
                <strong>Amount:</strong> Rs. {selectedPayment.total_price}
              </p>
              <p>
                <strong>Method:</strong> {selectedPayment.payment_method}
              </p>
              <p>
                <strong>Status:</strong> {selectedPayment.payment_status}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {selectedPayment.created_at
                  ? new Date(selectedPayment.created_at).toLocaleString("en-GB")
                  : "N/A"}
              </p>

              <hr />
              <p>
                <strong>Name:</strong> {userInfo.name}
              </p>
              <p>
                <strong>Mobile:</strong> {userInfo.mobile}
              </p>
              <p>
                <strong>Email:</strong> {userInfo.email}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Payments;
