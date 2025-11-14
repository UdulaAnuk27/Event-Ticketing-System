import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import ticketImage from "../assets/ticket.png";

const TicketBooking = () => {
  const [tickets, setTickets] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  // Event details passed from previous page or default
  const eventDetails = location.state?.event || {
    title: "Back to School 2025",
    date: "2025-11-02",
    venue: "Thurstan College, Colombo 7",
    price: 2500,
    image: ticketImage,
    event_id: 1,
  };

  // Logged-in user info from localStorage
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleTicketChange = (change) => {
    const newCount = tickets + change;
    if (newCount >= 1 && newCount <= 8) setTickets(newCount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = tickets * eventDetails.price;

    // Navigate to CardPayment page with event + user + tickets info
    navigate("/user/card-payment", {
      state: { event: eventDetails, tickets, total, user },
    });
  };

  const totalPrice = tickets * eventDetails.price;

  return (
    <div
      style={{
        minHeight: "70vh",
        background: "linear-gradient(135deg, #66c0ea 0%, #4b62a2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "850px",
          background: "#fff",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
        }}
      >
        {/* LEFT IMAGE */}
        <div
          style={{
            flex: 1.3,
            backgroundImage: `url(${eventDetails.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "350px",
          }}
        ></div>

        {/* RIGHT DETAILS */}
        <div
          style={{
            flex: 1,
            padding: "30px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%)",
          }}
        >
          <h4 className="text-center fw-bold text-dark mb-2">{eventDetails.title}</h4>
          <h3 className="text-center fw-semibold text-primary mb-2">🎟️ Book Your Ticket</h3>
          <p className="text-center text-muted mb-1"><strong>📅 {eventDetails.date}</strong></p>
          <p className="text-center text-muted mb-2"><strong>📍 {eventDetails.venue}</strong></p>
          <p className="text-center mb-3"><strong>💰 Rs.{eventDetails.price} per ticket</strong></p>

          <Form onSubmit={handleSubmit}>
            {/* Ticket Counter */}
            <Form.Group className="text-center mb-3">
              <Form.Label className="fw-semibold">Number of Tickets</Form.Label>
              <div className="d-flex justify-content-center align-items-center gap-3 mt-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => handleTicketChange(-1)}
                  disabled={tickets <= 1}
                  style={{ borderRadius: "50%", width: "35px", height: "35px", fontSize: "16px" }}
                >−</Button>
                <span className="fs-5 fw-bold">{tickets}</span>
                <Button
                  variant="outline-secondary"
                  onClick={() => handleTicketChange(1)}
                  disabled={tickets >= 8}
                  style={{ borderRadius: "50%", width: "35px", height: "35px", fontSize: "16px" }}
                >+</Button>
              </div>
            </Form.Group>

            {/* Total Price */}
            <Form.Group className="mb-3 text-center">
              <Form.Label className="fw-semibold">Total Price</Form.Label>
              <div className="fs-5 fw-bold text-success">Rs.{totalPrice}</div>
            </Form.Group>

            {/* Confirm Booking */}
            <Button
              type="submit"
              className="w-100 py-2 fw-semibold"
              style={{
                background: "linear-gradient(90deg, #38ef7d 0%, #11998e 100%)",
                border: "none",
                borderRadius: "10px",
                transition: "0.3s",
              }}
              onMouseOver={(e) => (e.target.style.background = "linear-gradient(90deg, #11998e 0%, #38ef7d 100%)")}
              onMouseOut={(e) => (e.target.style.background = "linear-gradient(90deg, #38ef7d 0%, #11998e 100%)")}
            >
              Confirm Booking ({tickets} Ticket{tickets > 1 ? "s" : ""})
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default TicketBooking;
