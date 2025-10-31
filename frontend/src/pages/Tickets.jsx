import React, { useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";

const Ticket = () => {
  const [tickets, setTickets] = useState(1);

  const eventDetails = {
    title: "Electric Dreams Festival 2024",
    date: "December 15, 2024",
    venue: "Skyline Arena, Downtown",
    price: 45,
  };

  const handleTicketChange = (change) => {
    const newCount = tickets + change;
    if (newCount >= 1 && newCount <= 8) setTickets(newCount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `🎉 Tickets booked! ${tickets} ticket(s) for ${eventDetails.title} on ${eventDetails.date}. Total: $${tickets * eventDetails.price}`
    );
  };

  const totalPrice = tickets * eventDetails.price;

  return (
    <div
      className="d-flex justify-content-center align-items-start bg-light"
      style={{ minHeight: "500px", paddingTop: "50px" }}
    >
      <Card style={{ width: "400px" }} className="shadow-sm p-3">
        <Card.Body>
          <Card.Title className="text-center mb-3">{eventDetails.title}</Card.Title>
          <Card.Text className="text-center text-muted mb-2">
            📅 {eventDetails.date}
          </Card.Text>
          <Card.Text className="text-center text-muted mb-3">
            📍 {eventDetails.venue}
          </Card.Text>
          <Card.Text className="text-center mb-3">
            <strong>Price per ticket: ${eventDetails.price}</strong>
          </Card.Text>

          <Form onSubmit={handleSubmit}>
            {/* Ticket Counter */}
            <Form.Group className="mb-3 text-center">
              <Form.Label>Number of Tickets</Form.Label>
              <div className="d-flex justify-content-center align-items-center gap-3 mt-2">
                <Button
                  variant="outline-primary"
                  onClick={() => handleTicketChange(-1)}
                  disabled={tickets <= 1}
                >
                  −
                </Button>
                <span className="fs-5">{tickets}</span>
                <Button
                  variant="outline-primary"
                  onClick={() => handleTicketChange(1)}
                  disabled={tickets >= 8}
                >
                  +
                </Button>
              </div>
            </Form.Group>

            {/* Total Price */}
            <Form.Group className="mb-3 text-center">
              <Form.Label>Total Price</Form.Label>
              <div className="fs-5 fw-bold">${totalPrice}</div>
            </Form.Group>

            {/* Book Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-100"
            >
              Book {tickets} Ticket{tickets > 1 ? "s" : ""} - ${totalPrice}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Ticket;
