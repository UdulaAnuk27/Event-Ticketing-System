import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Card, Modal } from "react-bootstrap";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT saved after login
        const response = await axios.get("http://localhost:5000/api/tickets/my-tickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching user tickets:", error);
        // alert("Failed to fetch tickets");
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
    <div style={{ padding: "20px", minHeight: "81vh", background: "#9ecbe0ff" }}>
      <h3 className="mb-4 text-primary">🎟️ My Tickets</h3>

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
                  <th>User</th>
                  <th>Amount (Rs.)</th>
                  <th>Original</th>
                  <th>Discount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="align-middle">
                      <td>{ticket.user_name || "N/A"}</td>
                      <td>Rs. {ticket.total_price}</td>
                      <td>Rs. {ticket.total_price}</td>
                      <td>Rs. 0</td>
                      <td>
                        <span
                          className={`badge ${
                            ticket.status === "Paid"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {ticket.status || "Paid"}
                        </span>
                      </td>
                      <td>{new Date(ticket.created_at).toLocaleString()}</td>
                      <td className="d-flex justify-content-center gap-2">
                        {ticket.qr_code && (
                          <>
                            <Button
                              size="sm"
                              variant="info"
                              onClick={() => handleView(ticket)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => downloadQR(ticket)}
                            >
                              Download QR
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Modal for ticket details */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🎫 Ticket Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTicket && (
            <div
              style={{
                display: "flex",
                gap: "30px",
                alignItems: "center",
                flexWrap: "wrap",
                paddingLeft: "30px",
              }}
            >
              {/* Left side: Ticket details */}
              <div style={{ flex: "1", minWidth: "200px", textAlign: "left" }}>
                <p>
                  <strong>Event Name:</strong>{" "}
                  {selectedTicket.event_title || "N/A"}
                </p>
                <p>
                  <strong>User Name:</strong>{" "}
                  {selectedTicket.user_name || "N/A"}
                </p>
                <p>
                  <strong>Mobile:</strong> {selectedTicket.user?.mobile  || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {selectedTicket.user_email || "N/A"}
                </p>
              </div>

              {/* Right side: QR code */}
              {selectedTicket.qr_code && (
                <div
                  style={{
                    flex: "1",
                    minWidth: "200px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={selectedTicket.qr_code}
                    alt="QR Code"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "contain",
                      marginBottom: "10px",
                    }}
                  />
                  <br />
                  <Button
                    variant="success"
                    onClick={() => downloadQR(selectedTicket)}
                  >
                    Download QR
                  </Button>
                </div>
              )}
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

export default MyTickets;
