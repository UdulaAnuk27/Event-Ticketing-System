import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

const TicketSuccess = () => {
    const { state } = useLocation(); // ticket + user data
    const navigate = useNavigate();

    const downloadQR = () => {
        const link = document.createElement("a");
        link.href = state.ticket.qr_code; // QR code URL
        link.download = `ticket_${state.ticket.id}.png`;
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
                    width: "800px",
                    borderRadius: "20px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "row",
                    overflow: "hidden",
                }}
            >
                {/* LEFT SIDE: Ticket + User Details */}
                <div
                    style={{
                        flex: 1,
                        background: "#f8f9fa",
                        padding: "25px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        borderRight: "1px solid #e0e0e0",
                    }}
                >
                    <h3 className="text-success mb-3">🎉 Booking Successful!</h3>
                    <h5 className="fw-bold mb-1">{state.ticket.event_title}</h5>
                    <p className="mb-1">📅 {state.ticket.event_date}</p>
                    <p className="mb-1">📍 {state.ticket.venue}</p>
                    <p className="mb-1">🎟️ Tickets: {state.ticket.tickets_count}</p>
                    <h6 className="text-success fw-bold mb-3">💰 Rs.{state.ticket.total_price}</h6>

                    <h6 className="fw-bold mb-1">👤 User Details</h6>
                    <p className="mb-1">Name: {state.user?.name}</p>
                    <p className="mb-1">Mobile: {state.user?.mobile}</p>
                    <p className="mb-0">Email: {state.user?.email}</p>
                </div>

                {/* RIGHT SIDE: QR code + Download */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "25px",
                        background: "#fff",
                    }}
                >
                    {state.ticket.qr_code && (
                        <img
                            src={state.ticket.qr_code}
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
                    )}
                    <Button
                        variant="success"
                        className="w-100 mb-2"
                        onClick={downloadQR}
                        style={{ borderRadius: "8px" }}
                    >
                        📥 Download QR
                    </Button>
                    <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => navigate("/user/events")}
                        style={{ borderRadius: "8px" }}
                    >
                        🔙 Back to Events
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default TicketSuccess;
