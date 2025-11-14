const Booking = require("../models/Booking");
const Event = require("../models/Event");
const User = require("../models/User");
const QRCode = require("qrcode");

exports.bookTicket = async (req, res) => {
  try {
    const { event_id, tickets_count } = req.body;
    const user_id = req.user.id;

    if (!event_id || !tickets_count) {
      return res
        .status(400)
        .json({ message: "Event ID and ticket count are required." });
    }

    // Find event
    const event = await Event.findByPk(event_id);
    if (!event) return res.status(404).json({ message: "Event not found." });

    // Find user
    const user = await User.findByPk(user_id, {
      attributes: ["id", "first_name", "last_name", "mobile"],
      include: ["details"],
    });

    // Calculate total price
    const total_price = parseFloat(event.price) * tickets_count;

    // 📅 Automatically set booking date
    const booking_date = new Date();

    // 🎟️ Generate QR code text
    const qrText = `
━━━━━━━━━━━━━━━━━━━━━━
🎟️ EVENT TICKET SYSTEM
━━━━━━━━━━━━━━━━━━━━━━
🏛️  EVENT DETAILS
• Title: ${event.title}
• Date: ${event.date}
• Venue: ${event.location || event.venue}

👤  ATTENDEE DETAILS
• Name: ${user.first_name} ${user.last_name}
• Mobile: ${user.mobile}
• Email: ${user.details?.email || "N/A"}

🎫  BOOKING INFO
• Tickets: ${tickets_count}
• Total: Rs. ${total_price}
• Booked On: ${booking_date.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━
✅  Verified Entry Ticket
Thank you for your purchase!
Enjoy the Event 🎉
━━━━━━━━━━━━━━━━━━━━━━
`;

    const qr_code = await QRCode.toDataURL(qrText);

    // 💾 Save booking
    const booking = await Booking.create({
      event_id,
      user_id,
      tickets_count,
      total_price,
      qr_code,
      booking_date, // store it in DB
    });

    // Return detailed response
    const bookingWithDetails = {
      ...booking.toJSON(),
      event: {
        event_id: event.event_id,
        title: event.title,
        date: event.date,
        venue: event.location || event.venue,
        price: event.price,
      },
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        mobile: user.mobile,
        email: user.details?.email || "N/A",
      },
    };

    res.status(201).json({
      message: "Ticket booked successfully.",
      booking: bookingWithDetails,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server error while booking ticket." });
  }
};

// ===============================
// Get My Bookings (User)
// ===============================
exports.getMyBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const bookings = await Booking.findAll({
      where: { user_id },
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["event_id", "title", "date", "venue", "price", "image"],
        },
      ],
      order: [["booking_date", "DESC"]],
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get My Bookings Error:", error);
    res.status(500).json({ message: "Server error while retrieving bookings." });
  }
};

// ===============================
// Cancel Booking (User)
// ===============================
exports.cancelBooking = async (req, res) => {
  try {
    const booking_id = req.params.id;
    const user_id = req.user.id;

    const booking = await Booking.findOne({ where: { booking_id, user_id } });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or not authorized." });
    }

    await booking.destroy();

    res.status(200).json({ message: "Booking cancelled successfully." });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({ message: "Server error while cancelling booking." });
  }
};

// ===============================
// Get All Bookings (Admin)
// ===============================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "first_name", "last_name", "mobile"],
        },
        {
          model: Event,
          as: "event",
          attributes: ["event_id", "title", "date", "venue"],
        },
      ],
      order: [["booking_date", "ASC"]],
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get All Bookings Error:", error);
    res.status(500).json({ message: "Server error while retrieving all bookings." });
  }
};
