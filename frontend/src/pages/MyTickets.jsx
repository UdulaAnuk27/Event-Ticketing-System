import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Card, Modal } from "react-bootstrap";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "N/A",
    mobile: "N/A",
    email: "N/A",
  });

  useEffect(() => {
    const fetchTicketsAndUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // 🧍 Fetch dashboard data (name & mobile)
        const dashboardRes = await axios.get(
          "http://localhost:5000/api/user/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const dashboardData = dashboardRes.data.user || dashboardRes.data;

        // 📧 Fetch user details (email, profile image)
        const detailsRes = await axios.get(
          "http://localhost:5000/api/user-details",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const detailsData = detailsRes.data.user?.details || {};

        // 🧾 Combine user info
        setUserInfo({
          name: `${dashboardData.first_name || ""} ${
            dashboardData.last_name || ""
          }`.trim(),
          mobile: dashboardData.mobile || "N/A",
          email: detailsData.email || "N/A",
        });

        // 🎟️ Fetch user bookings
        const bookingRes = await axios.get(
          "http://localhost:5000/api/bookings/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const mappedTickets = bookingRes.data.map((t) => ({
          ...t,
          event_title: t.event?.title || "N/A",
          event_date: t.event?.date || "N/A",
          event_venue: t.event?.venue || t.event?.location || "N/A",
          booking_date: t.booking_date || t.created_at || null,
        }));

        setTickets(mappedTickets);
      } catch (error) {
        console.error("Error fetching tickets or user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketsAndUser();
  }, []);

  const downloadQR = (ticket) => {
    if (!ticket.qr_code) return;
    const link = document.createElement("a");
    link.href = ticket.qr_code;
    link.download = `ticket_${ticket.id || ticket.booking_id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div style={{ padding: "20px", minHeight: "80vh", background: "#9ecbe0ff" }}>
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
            >
              <thead className="bg-primary text-white">
                <tr>
                  <th>Event</th>
                  <th>Venue</th>
                  <th>Tickets</th>
                  <th>Amount (Rs.)</th>
                  <th>Booked On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id || ticket.booking_id}>
                      <td>{ticket.event_title}</td>
                      <td>{ticket.event_venue}</td>
                      <td>{ticket.tickets_count}</td>
                      <td>{ticket.total_price}</td>
                      <td>
                        {ticket.booking_date
                          ? new Date(ticket.booking_date).toLocaleString()
                          : "N/A"}
                      </td>
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

      {/* 🪪 Ticket Details Modal */}
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
                flexWrap: "wrap",
                paddingLeft: "20px",
              }}
            >
              {/* Left side */}
              <div style={{ flex: 1, minWidth: "250px", textAlign: "left" }}>
                <p>
                  <strong>Event:</strong> {selectedTicket.event_title}
                </p>
                <p>
                  <strong>Event Date:</strong> {selectedTicket.event_date}
                </p>
                <p>
                  <strong>Venue:</strong> {selectedTicket.event_venue}
                </p>
                <p>
                  <strong>Tickets:</strong> {selectedTicket.tickets_count}
                </p>
                <p>
                  <strong>Total:</strong> Rs. {selectedTicket.total_price}
                </p>
                <p>
                  <strong>Booked On:</strong>{" "}
                  {selectedTicket.booking_date
                    ? new Date(selectedTicket.booking_date).toLocaleString()
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

              {/* Right: QR */}
              {selectedTicket.qr_code && (
                <div
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={selectedTicket.qr_code}
                    alt="QR Code"
                    style={{
                      width: "220px",
                      height: "220px",
                      marginBottom: "15px",
                    }}
                  />
                  <Button
                    variant="success"
                    onClick={() => downloadQR(selectedTicket)}
                    style={{ width: "150px" }}
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
