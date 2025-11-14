const express = require("express");
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { verifyAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Public route
router.get("/", getEvents);

// Admin routes
router.post("/", verifyAdmin, upload.single("event_image"), createEvent);
router.put("/:id", verifyAdmin, upload.single("event_image"), updateEvent);
router.delete("/:id", verifyAdmin, deleteEvent);

module.exports = router;
