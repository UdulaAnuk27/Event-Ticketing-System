import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spinner, Modal, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const API_URL = "http://localhost:5000/api/events";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_URL);
        setEvents(res.data.events || []);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleBook = (event) => {
    navigate("/user/ticket-booking", { state: { event } });
  };

  const handleViewImage = (event) => {
    setSelectedImage(event);
    setShowImageModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return <p className="text-center py-5">No upcoming events found.</p>;
  }

  return (
    <div style={{ padding: "20px", minHeight: "79vh", background: "#9ecbe0ff" }}>
      <div
        style={{
          maxWidth: "1000px",  // narrowed container
          margin: "0 auto",    // center content
        }}
      >
        <h2 className="mb-4 text-center">🎉 Upcoming Events</h2>
        <Row className="g-4 justify-content-start">
          {events.map((event) => (
            <Col key={event.event_id} xs={12} sm={6} md={3}>
              <Card
                style={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  height: "100%",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                }}
              >
                <Card.Img
                  as={Image}
                  src={event.image || "https://via.placeholder.com/300x220?text=No+Image"}
                  alt={event.title}
                  style={{ height: "220px", objectFit: "cover", cursor: "pointer" }}
                  fluid
                  rounded
                  onClick={() => handleViewImage(event)}
                />
                <Card.Body
                  className="text-center d-flex flex-column justify-content-between"
                  style={{ height: "220px" }}
                >
                  <div>
                    <Card.Title className="fw-bold">{event.title}</Card.Title>
                    <Card.Text className="mb-1">
                      📅 {new Date(event.date).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text className="mb-2">📍 {event.venue}</Card.Text>
                  </div>
                  <div>
                    <h6 className="text-success mb-3">
                      💰 Rs.{parseFloat(event.price).toLocaleString()}
                    </h6>
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

      {/* Image View Modal */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Event Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedImage?.image ? (
            <Image
              src={selectedImage.image}
              alt={selectedImage.title}
              fluid
              rounded
              style={{ maxHeight: "300px" }}
            />
          ) : (
            <p className="text-muted">No image available.</p>
          )}
          <h5 className="mt-3">{selectedImage?.title}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Events;
