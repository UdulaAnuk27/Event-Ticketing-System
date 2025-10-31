import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Card, Modal } from "react-bootstrap";

const MyQRCodes = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);

        // ✅ Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You must be logged in to view your tickets.");
          setLoading(false);
          return;
        }

        // ✅ Fetch tickets with Authorization header
        const res = await axios.get("http://localhost:5000/api/tickets/my-tickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTickets(res.data);
      } catch (err) {
        console.error("Error fetching user tickets:", err);
        alert("Failed to fetch tickets. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const downloadQR = (ticket) => {
    const link = document.createElement("a");
    link.href = ticket.qr_code;
    link.download = `ticket_${ticket.id}.png`;
    link.click();
  };

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedTicket(null);
    setShowModal(false);
  };

  return (
    <div style={{ padding: "20px", minHeight: "81vh", background: "#d2e6f7" }}>
      <h3 className="mb-4 text-primary">🧾 My QR Codes</h3>

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
                  <th>QR Code</th>
                  <th>Ticket ID</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No QR Codes found
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="align-middle">
                      <td>
                        {ticket.qr_code ? (
                          <img
                            src={ticket.qr_code}
                            alt="QR"
                            style={{
                              width: "70px",
                              height: "70px",
                              objectFit: "contain",
                              borderRadius: "8px",
                            }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>{ticket.id}</td>
                      <td>{ticket.user?.name || ticket.user_name || "N/A"}</td>
                      <td>
                        <span
                          className={`badge ${ticket.status === "Paid"
                              ? "bg-success"
                              : "bg-warning text-dark"
                            }`}
                        >
                          {ticket.status || "Active"}
                        </span>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => handleView(ticket)}
                        >
                          View
                        </Button>{" "}
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => downloadQR(ticket)}
                        >
                          Download
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

      {/* Modal for QR details */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>🎫 QR Code Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTicket && (
            <div className="d-flex flex-column align-items-center text-center">
              <img
                src={selectedTicket.qr_code}
                alt="QR"
                style={{
                  width: "200px",
                  height: "200px",
                  marginBottom: "15px",
                  borderRadius: "10px",
                }}
              />
              <p>
                <strong>Ticket ID:</strong> {selectedTicket.id}
              </p>
              <p>
                <strong>User:</strong>{" "}
                {selectedTicket.user?.name || selectedTicket.user_name || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedTicket.status || "Pending"}
              </p>
              <Button variant="success" onClick={() => downloadQR(selectedTicket)}>
                Download QR
              </Button>
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

export default MyQRCodes;
