import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCalendarAlt,
  FaEye,
} from "react-icons/fa";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    venue: "",
    price: "",
    imageFile: null,
    previewImage: null,
  });

  // Image View Modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const API_URL = "http://localhost:5000/api/events";
  axios.defaults.withCredentials = true;

  // Fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setEvents(res.data.events || []);
      setFiltered(res.data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to fetch events!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Search filter
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(events.filter((e) => e.title?.toLowerCase().includes(q)));
  }, [search, events]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setFormData({
        ...formData,
        imageFile: files[0],
        previewImage: URL.createObjectURL(files[0]),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Open Add/Edit modal
  const openModal = (event = null) => {
    if (event) {
      setEditing(event);
      setFormData({
        title: event.title,
        date: event.date,
        venue: event.venue,
        price: event.price,
        imageFile: null,
        previewImage: event.image || null,
      });
    } else {
      setEditing(null);
      setFormData({
        title: "",
        date: "",
        venue: "",
        price: "",
        imageFile: null,
        previewImage: null,
      });
    }
    setShowModal(true);
  };

  // Save event (create or update)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const data = new FormData();
      data.append("title", formData.title);
      data.append("date", formData.date);
      data.append("venue", formData.venue);
      data.append("price", formData.price);
      if (formData.imageFile) data.append("event_image", formData.imageFile);

      if (editing) {
        await axios.put(`${API_URL}/${editing.event_id}`, data, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
        toast.success("Event updated successfully!");
      } else {
        await axios.post(API_URL, data, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
        toast.success("Event added successfully!");
      }

      setShowModal(false);
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err);
      toast.error(err.response?.data?.message || "Failed to save event!");
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_URL}/${id}`, { headers });
      toast.success("Event deleted successfully!");
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error(err.response?.data?.message || "Failed to delete event!");
    }
  };

  // View image modal
  const handleViewImage = (event) => {
    setSelectedImage(event);
    setShowImageModal(true);
  };

  return (
    <div
      className="container py-5"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        minHeight: "80vh",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="bg-white p-4 rounded shadow-lg">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-primary mb-0">
            <FaCalendarAlt className="me-2" /> Manage Events
          </h3>
          <button
            className="btn btn-success d-flex align-items-center"
            onClick={() => openModal()}
          >
            <FaPlus className="me-2" /> Add Event
          </button>
        </div>

        {/* Search */}
        <div className="input-group mb-4">
          <span className="input-group-text bg-primary text-white">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search events by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Events Table */}
        {loading ? (
          <div className="text-center py-5 text-muted">Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">No events found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Price (LKR)</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event, index) => (
                  <tr key={event.event_id}>
                    <td>{index + 1}</td>
                    <td>{event.title}</td>
                    <td>
                      {event.date
                        ? new Date(event.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{event.venue}</td>
                    <td className="text-center">{parseFloat(event.price).toLocaleString()}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-info me-2"
                        onClick={() => handleViewImage(event)}
                      >
                        <FaEye className="me-1" /> View
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openModal(event)}
                      >
                        <FaEdit className="me-1" /> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(event.event_id)}
                      >
                        <FaTrash className="me-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit Event" : "Add New Event"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Venue</Form.Label>
              <Form.Control
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price (LKR)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Event Image</Form.Label>
              <Form.Control
                type="file"
                name="imageFile"
                onChange={handleChange}
                accept="image/*"
              />
              {formData.previewImage && (
                <div className="mt-2 text-center">
                  <Image
                    src={formData.previewImage}
                    alt="Preview"
                    fluid
                    rounded
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editing ? "Save Changes" : "Add Event"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

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

export default ManageEvents;
