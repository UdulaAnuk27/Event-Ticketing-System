import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

const TicketSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.ticket) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "80vh", background: "#f8f9fa" }}
      >
        <h4 className="text-danger mb-3">⚠️ Ticket details not found!</h4>
        <Button variant="primary" onClick={() => navigate("/user/events")}>
          🔙 Back to Events
        </Button>
      </div>
    );
  }

  const { ticket, user } = state;

  const downloadQR = () => {
    if (!ticket.qr_code) return;
    const link = document.createElement("a");
    link.href = ticket.qr_code;
    link.download = `ticket_${ticket.id}.png`;
    link.click();
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        background: "linear-gradient(135deg, #66c0ea 0%, #4b62a2 100%)",
      }}
    >
      <Card
        style={{
          width: "850px",
          borderRadius: "20px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            background: "#f8f9fa",
            padding: "25px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRight: "1px solid #e0e0e0",
            minWidth: "300px",
          }}
        >
          <h3 className="text-success mb-3 text-center">🎉 Booking Successful!</h3>
          <h5 className="fw-bold mb-1">{ticket.event_title}</h5>
          <p className="mb-1">📅 {ticket.event_date}</p>
          <p className="mb-1">📍 {ticket.venue}</p>
          <p className="mb-1">🎟️ Tickets: {ticket.tickets_count}</p>
          <h6 className="text-success fw-bold mb-3">💰 Rs.{ticket.total_price}</h6>
          <hr />
          <h6 className="fw-bold mb-1">👤 User Details</h6>
          <p className="mb-1">Name: {user?.name || "N/A"}</p>
          <p className="mb-1">Mobile: {user?.mobile || "N/A"}</p>
          <p className="mb-0">Email: {user?.email || "N/A"}</p>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "25px",
            background: "#fff",
            minWidth: "300px",
          }}
        >
          {ticket.qr_code ? (
            <img
              src={ticket.qr_code}
              alt="QR Code"
              style={{
                width: "220px",
                height: "220px",
                border: "2px dashed #28a745",
                borderRadius: "15px",
                padding: "10px",
                marginBottom: "20px",
              }}
            />
          ) : (
            <p className="text-muted mb-4">No QR code available</p>
          )}

          <Button
            variant="success"
            className="w-100 mb-2 fw-semibold"
            onClick={downloadQR}
            style={{
              borderRadius: "8px",
              background: "linear-gradient(90deg, #38ef7d 0%, #11998e 100%)",
              border: "none",
            }}
          >
            📥 Download QR
          </Button>

          <Button
            variant="primary"
            className="w-100 fw-semibold"
            onClick={() => navigate("/user/events")}
            style={{
              borderRadius: "8px",
              background: "linear-gradient(90deg, #56ccf2 0%, #2f80ed 100%)",
              border: "none",
            }}
          >
            🔙 Back to Events
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TicketSuccess;
