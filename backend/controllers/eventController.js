const Event = require("../models/Event");

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    const eventsWithURL = events.map((e) => ({
      ...e.toJSON(),
      image: e.image
        ? `${req.protocol}://${req.get("host")}/uploads/event_images/${e.image}`
        : null,
    }));
    res.status(200).json({ events: eventsWithURL });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// Create event (Admin only)
exports.createEvent = async (req, res) => {
  try {
    const { title, date, venue, price } = req.body;
    const image = req.file ? req.file.originalname : null;

    const event = await Event.create({ title, date, venue, price, image });
    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create event" });
  }
};

// Update event (Admin only)
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, venue, price } = req.body;
    const image = req.file ? req.file.originalname : undefined;

    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.update({ title, date, venue, price, ...(image && { image }) });
    res.status(200).json({ message: "Event updated successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update event" });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.destroy();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};
