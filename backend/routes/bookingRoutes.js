const express = require("express");
const router = express.Router();
const {
  bookTicket,
  getAllBookings,
  getMyBookings,
  cancelBooking,
} = require("../controllers/bookingController");
const { verifyUser, verifyAdmin } = require("../middlewares/authMiddleware");

// User Routes
router.post("/ticket", verifyUser, bookTicket);          // Book a ticket
router.get("/my", verifyUser, getMyBookings);          // Get user's own bookings
router.delete("/:id", verifyUser, cancelBooking);      // Cancel booking

// Admin Routes
router.get("/all", verifyAdmin, getAllBookings);       // View all bookings

module.exports = router;
