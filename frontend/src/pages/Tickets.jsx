import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaTrash, FaSearch } from "react-icons/fa";
import { Modal, Button, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Tickets = () => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal for QR Code view
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const API_URL = "http://localhost:5000/api/bookings/all";
  axios.defaults.withCredentials = true;

  // Fetch all bookings (Admin)
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to fetch bookings!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Search filter
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      bookings.filter(
        (b) =>
          b.user?.first_name?.toLowerCase().includes(q) ||
          b.user?.last_name?.toLowerCase().includes(q) ||
          b.event?.title?.toLowerCase().includes(q)
      )
    );
  }, [search, bookings]);

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedTicket(null);
    setShowModal(false);
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Booking cancelled successfully!");
      fetchBookings();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      toast.error(err.response?.data?.message || "Failed to cancel booking!");
    }
  };

  const downloadQR = (ticket) => {
    if (!ticket.qr_code) return;
    const link = document.createElement("a");
    link.href = ticket.qr_code;
    link.download = `ticket_${ticket.booking_id}.png`;
    link.click();
  };

  return (
    <div
      className="container py-5"
      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", minHeight: "80vh" }}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="bg-white p-4 rounded shadow-lg">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-primary mb-0">🧾 Manage Bookings</h3>
        </div>

        {/* Search */}
        <div className="input-group mb-4">
          <span className="input-group-text bg-primary text-white">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by user name or event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="text-center py-5 text-muted">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">No bookings found.</div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Event</th>
                  <th>Tickets</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, index) => (
                  <tr key={b.booking_id}>
                    <td>{index + 1}</td>
                    <td>
                      {b.user?.first_name} {b.user?.last_name} <br />
                      <small>{b.user?.mobile}</small>
                    </td>
                    <td>
                      {b.event?.title} <br />
                      <small>
                        {b.event?.date ? new Date(b.event.date).toLocaleDateString() : "N/A"}
                      </small>
                    </td>
                    <td>{b.tickets_count}</td>
                    <td>{parseFloat(b.total_price).toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          b.status === "Paid" ? "bg-success" : "bg-warning text-dark"
                        }`}
                      >
                        {b.status || "Active"}
                      </span>
                    </td>
                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="outline-info"
                        className="me-2"
                        onClick={() => handleView(b)}
                      >
                        <FaEye /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleCancel(b.booking_id)}
                      >
                        <FaTrash /> Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>🎫 Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedTicket && (
            <>
              {selectedTicket.qr_code ? (
                <img
                  src={selectedTicket.qr_code}
                  alt="QR Code"
                  style={{ width: "200px", height: "200px", marginBottom: "15px" }}
                />
              ) : (
                <p className="text-muted">No QR Code available</p>
              )}
              <p>
                <strong>User:</strong> {selectedTicket.user?.first_name}{" "}
                {selectedTicket.user?.last_name}
              </p>
              <p>
                <strong>Event:</strong> {selectedTicket.event?.title}
              </p>
              <p>
                <strong>Tickets:</strong> {selectedTicket.tickets_count}
              </p>
              <p>
                <strong>Total:</strong> {parseFloat(selectedTicket.total_price).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedTicket.status || "Active"}
              </p>
              <Button
                variant="success"
                onClick={() => downloadQR(selectedTicket)}
              >
                Download QR
              </Button>
            </>
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

export default Tickets;
