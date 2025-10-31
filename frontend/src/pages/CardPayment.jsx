import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import axios from "axios";

const Payment = () => {
  const { state } = useLocation(); // event + user info
  const navigate = useNavigate();
  const [cardType, setCardType] = useState("Visa");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  // Handle controlled input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      // Remove all non-digits
      let num = value.replace(/\D/g, "").slice(0, 16);
      // Add space every 4 digits
      num = num.replace(/(\d{4})(?=\d)/g, "$1 ");
      setCardDetails({ ...cardDetails, cardNumber: num });
    } else if (name === "cvv") {
      // Only digits, max 3
      const cvv = value.replace(/\D/g, "").slice(0, 3);
      setCardDetails({ ...cardDetails, cvv });
    } else if (name === "expiry") {
      // Only digits, auto insert /
      let exp = value.replace(/\D/g, "").slice(0, 4);
      if (exp.length > 2) {
        exp = exp.slice(0, 2) + "/" + exp.slice(2);
      }
      setCardDetails({ ...cardDetails, expiry: exp });
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    // Basic validation for card details
    if (
      !cardDetails.cardNumber ||
      !cardDetails.cardName ||
      !cardDetails.expiry ||
      !cardDetails.cvv
    ) {
      alert("⚠️ Please fill in all card details!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("⚠️ Please log in to continue payment!");
        navigate("/user/login");
        return;
      }

      // Prepare payment data
      const paymentData = {
        event_title: state.title,
        event_date: state.date,
        venue: state.venue,
        tickets_count: state.tickets,
        total_price: state.total,
        card_type: cardType,
        card_last4: cardDetails.cardNumber.slice(-4), // Store only last 4 digits (safe)
      };

      // Send payment + booking request
      const res = await axios.post(
        "http://localhost:5000/api/tickets/book",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔐 Send JWT token
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // If booking was successful
      if (res.data.success) {
        alert("✅ Payment Successful!");

        // Navigate to ticket success page
        navigate("/user/ticket-success", {
          state: { ticket: res.data.ticket, user: res.data.user },
        });
      } else {
        alert(res.data.message || "❌ Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert(
        error.response?.data?.message ||
          "❌ Payment failed due to server error. Please try again later."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        background: "linear-gradient(135deg, #4b62a2 0%, #66c0ea 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "850px",
          borderRadius: "20px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "row",
          padding: "20px",
        }}
      >
        {/* LEFT: Ticket + User Details */}
        <div
          style={{
            flex: 1,
            background: "#f8f9fa",
            borderRadius: "15px",
            padding: "20px",
            marginRight: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            border: "1px solid #e0e0e0",
          }}
        >
          <h5 className="fw-bold text-primary mb-1">{state.title}</h5>
          <p className="mb-1">📅 {state.date}</p>
          <p className="mb-1">📍 {state.venue}</p>
          <p className="mb-1">🎟️ Tickets: {state.tickets}</p>
          <h6 className="text-success fw-bold mb-2">💰 Rs.{state.total}</h6>

          <hr />

          <h6 className="fw-bold mb-1">👤 User Details</h6>
          <p className="mb-1">Name: {state.user?.name || "John Doe"}</p>
          <p className="mb-1">
            Mobile: {state.user?.mobile || "+94 712345678"}
          </p>
          <p className="mb-0">
            Email: {state.user?.email || "example@email.com"}
          </p>
        </div>

        {/* RIGHT: Payment Form */}
        <Card.Body style={{ flex: 1, padding: "20px" }}>
          <h5 className="text-center mb-3 text-primary">💳 Payment Details</h5>

          <Form onSubmit={handlePayment}>
            <Form.Group className="mb-2">
              <Form.Label>Card Type</Form.Label>
              <div className="d-flex align-items-center gap-3">
                <Form.Check
                  type="radio"
                  id="visa"
                  label={
                    <>
                      <FaCcVisa size={22} color="#1a1f71" /> Visa
                    </>
                  }
                  name="cardType"
                  checked={cardType === "Visa"}
                  onChange={() => setCardType("Visa")}
                />
                <Form.Check
                  type="radio"
                  id="mastercard"
                  label={
                    <>
                      <FaCcMastercard size={22} color="#eb001b" /> MasterCard
                    </>
                  }
                  name="cardType"
                  checked={cardType === "MasterCard"}
                  onChange={() => setCardType("MasterCard")}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                name="cardNumber"
                placeholder="xxxx xxxx xxxx xxxx"
                required
                value={cardDetails.cardNumber}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                name="cardName"
                placeholder="John Doe"
                required
                value={cardDetails.cardName}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex gap-2 mb-2">
              <Form.Group className="flex-fill">
                <Form.Label>Expiry</Form.Label>
                <Form.Control
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  required
                  value={cardDetails.expiry}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="flex-fill">
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  type="password"
                  name="cvv"
                  placeholder="•••"
                  required
                  value={cardDetails.cvv}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>

            <Button
              type="submit"
              variant="success"
              className="w-100 py-2 fw-semibold"
              style={{
                background: "linear-gradient(90deg, #38ef7d 0%, #11998e 100%)",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Pay Now 💰
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Payment;
