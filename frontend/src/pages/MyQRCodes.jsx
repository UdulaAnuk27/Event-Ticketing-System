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

        const token = localStorage.getItem("token");
        if (!token) {
          alert("You must be logged in to view your QR codes.");
          setLoading(false);
          return;
        }

        // ✅ Use new endpoint: /api/bookings/my
        const res = await axios.get("http://localhost:5000/api/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Ensure QR and event info are mapped properly
        const mappedTickets = res.data.map((t) => ({
          id: t.id,
          status: t.status || "Active",
          qr_code: t.qr_code,
          event: t.event || {},
          user: t.user || {},
          booking_date: t.booking_date || t.created_at || null,
        }));

        setTickets(mappedTickets);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        // alert("Failed to fetch tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const downloadQR = (ticket) => {
    if (!ticket.qr_code) return alert("No QR code available for this ticket.");
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
      <h3 className="mb-4 text-primary">🧾 My QR Codes</h3>

      {loading ? (
        <div className="text-center py-5">
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
                  <th>Event</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">
                      No tickets or QR codes found.
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
                      <td>{ticket.event?.title || "N/A"}</td>
                      <td>{ticket.event?.date || "N/A"}</td>
                      <td>
                        <span
                          className={`badge ${
                            ticket.status === "Paid"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {ticket.status}
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
          <Modal.Title>🎫 Ticket Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTicket && (
            <div className="d-flex flex-column align-items-center text-center">
              {selectedTicket.qr_code ? (
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
              ) : (
                <p>No QR code available.</p>
              )}
              <p>
                <strong>Event:</strong> {selectedTicket.event?.title || "N/A"}
              </p>
              <p>
                <strong>Date:</strong> {selectedTicket.event?.date || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {selectedTicket.status}
              </p>
              <Button
                variant="success"
                onClick={() => downloadQR(selectedTicket)}
              >
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
