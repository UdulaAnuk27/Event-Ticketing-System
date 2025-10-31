import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Card, Modal } from "react-bootstrap";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch user payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please log in to view payments.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/payments/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
        alert("Failed to fetch payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedPayment(null);
    setShowModal(false);
  };

  return (
    <div style={{ padding: "20px", minHeight: "81vh", background: "#e0f2ff" }}>
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
                  <th>Payment ID</th>
                  <th>Ticket ID</th>
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
                    <td colSpan={7} className="text-center py-4">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="align-middle">
                      <td>{payment.id}</td>
                      <td>{payment.ticket_id}</td>
                      <td>Rs. {payment.amount}</td>
                      <td>{payment.method || "Card"}</td>
                      <td>
                        <span
                          className={`badge ${
                            payment.status === "Success"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        {new Date(payment.created_at).toLocaleString("en-GB")}
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

      {/* Modal for Payment Details */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>🧾 Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <div style={{ lineHeight: "1.8" }}>
              <p>
                <strong>Payment ID:</strong> {selectedPayment.id}
              </p>
              <p>
                <strong>Ticket ID:</strong> {selectedPayment.ticket_id}
              </p>
              <p>
                <strong>Amount:</strong> Rs. {selectedPayment.amount}
              </p>
              <p>
                <strong>Method:</strong> {selectedPayment.method || "Card"}
              </p>
              <p>
                <strong>Status:</strong> {selectedPayment.status}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedPayment.created_at).toLocaleString("en-GB")}
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
