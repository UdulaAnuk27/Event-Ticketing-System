import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import axios from "axios";

const CardPayment = () => {
  const { state } = useLocation(); // event + tickets + user + total
  const navigate = useNavigate();

  const { event, tickets, total } = state || {};
  const [user, setUser] = useState(state?.user || null);
  const [loading, setLoading] = useState(true);

  const [cardType, setCardType] = useState("Visa");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch dashboard data (name & mobile)
        const dashboardRes = await axios.get(
          "http://localhost:5000/api/user/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const dashboardData = dashboardRes.data.user || dashboardRes.data;

        // Fetch user details (email, profile image)
        const detailsRes = await axios.get(
          "http://localhost:5000/api/user-details",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const detailsData = detailsRes.data.user || detailsRes.data;

        const email = detailsData?.details?.email || "N/A";
        const profile_image =
          detailsData?.details?.profile_image ||
          "https://cdn-icons-png.flaticon.com/512/847/847969.png";

        setUser({
          first_name: dashboardData.first_name,
          last_name: dashboardData.last_name,
          mobile: dashboardData.mobile,
          email,
          profile_image,
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (!user) fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      let num = value.replace(/\D/g, "").slice(0, 16);
      num = num.replace(/(\d{4})(?=\d)/g, "$1 ");
      setCardDetails({ ...cardDetails, cardNumber: num });
    } else if (name === "cvv") {
      setCardDetails({ ...cardDetails, cvv: value.replace(/\D/g, "").slice(0, 3) });
    } else if (name === "expiry") {
      let exp = value.replace(/\D/g, "").slice(0, 4);
      if (exp.length > 2) exp = exp.slice(0, 2) + "/" + exp.slice(2);
      setCardDetails({ ...cardDetails, expiry: exp });
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!event || !user) {
      alert("⚠️ Missing event or user data!");
      return;
    }

    if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiry || !cardDetails.cvv) {
      alert("⚠️ Please fill in all card details!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ Please login first!");
        navigate("/user/login");
        return;
      }

      const bookingData = {
        event_id: event.event_id,
        tickets_count: tickets,
        card_type: cardType,
        card_last4: cardDetails.cardNumber.slice(-4),
      };

      const res = await axios.post("http://localhost:5000/api/bookings/ticket", bookingData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (res.status === 201) {
        navigate("/user/ticket-success", {
          state: { ticket: res.data.booking, user },
        });
      } else {
        alert(res.data.message || "Payment failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading user info...</div>;
  }

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
        {/* LEFT: Event + User Details */}
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
          <h5 className="fw-bold text-primary mb-1">{event?.title}</h5>
          <p className="mb-1">📅 {event?.date}</p>
          <p className="mb-1">📍 {event?.venue}</p>
          <p className="mb-1">🎟️ Tickets: {tickets}</p>
          <h6 className="text-success fw-bold mb-2">💰 Rs.{total}</h6>
          <hr />
          <h6 className="fw-bold mb-1">👤 User Details</h6>
          <p className="mb-1">Name: {user?.first_name} {user?.last_name}</p>
          <p className="mb-1">Mobile: {user?.mobile}</p>
          <p className="mb-0">Email: {user?.email}</p>
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
                  label={<><FaCcVisa /> Visa</>}
                  name="cardType"
                  checked={cardType === "Visa"}
                  onChange={() => setCardType("Visa")}
                />
                <Form.Check
                  type="radio"
                  id="mastercard"
                  label={<><FaCcMastercard /> MasterCard</>}
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
                value={cardDetails.cardNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                name="cardName"
                placeholder="John Doe"
                value={cardDetails.cardName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2 mb-2">
              <Form.Group className="flex-fill">
                <Form.Label>Expiry</Form.Label>
                <Form.Control
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="flex-fill">
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  type="password"
                  name="cvv"
                  placeholder="•••"
                  value={cardDetails.cvv}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>

            <Button
              type="submit"
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

export default CardPayment;
