import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import eventImage from "../assets/ticket.png";
import eventImage2 from "../assets/ticket2.png";


const Events = () => {
  const navigate = useNavigate();

  const events = [
    {
      id: 1,
      title: "Back to School 2025",
      date: "2025-11-02",
      venue: "Thurstan College, Colombo 7",
      price: 2500,
      image: eventImage,
    },
    {
      id: 2,
      title: "Music Fest 2025",
      date: "2025-12-10",
      venue: "Galle Face Green, Colombo",
      price: 3000,
      image: eventImage2,
    },
    {
      id: 3,
      title: "Tech Expo 2025",
      date: "2025-10-25",
      venue: "BMICH, Colombo",
      price: 1500,
      image: eventImage,
    },
    {
      id: 4,
      title: "Art Carnival 2025",
      date: "2025-11-15",
      venue: "Colombo Art Gallery",
      price: 2000,
      image: eventImage,
    },
  ];

  const handleBook = (event) => {
    // Navigate to /ticket page and pass event details via state
    navigate("/user/ticket-booking", { state: { event } });
  };

  return (
    <div style={{ padding: "20px", minHeight: "79vh", background: "#86c6e4ff" }}>
      <h2 className="mb-4 text-center">🎉 Upcoming Events</h2>
      <Row className="g-4 justify-content-center">
        {events.map((event) => (
          <Col key={event.id} xs={12} sm={6} md={3}>
            <Card style={{ borderRadius: "15px", overflow: "hidden", height: "100%", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}>
              <Card.Img
                variant="top"
                src={event.image}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body className="text-center d-flex flex-column justify-content-between" style={{ height: "220px" }}>
                <div>
                  <Card.Title className="fw-bold">{event.title}</Card.Title>
                  <Card.Text className="mb-1">📅 {event.date}</Card.Text>
                  <Card.Text className="mb-2">📍 {event.venue}</Card.Text>
                </div>
                <div>
                  <h6 className="text-success mb-3">💰 Rs.{event.price}</h6>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => handleBook(event)}
                  >
                    Book Now
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Events;
