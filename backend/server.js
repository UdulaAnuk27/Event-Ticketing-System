// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const sequelize = require("./config/db");

// Routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userDetailsRoutes = require("./routes/userDetailsRoute");
const adminDetailsRoutes = require("./routes/adminDetailsRoute");
const ticketRoutes = require("./routes/ticketRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const otpRoutes = require("./routes/otpRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_ORIGIN, "http://localhost:5173"],
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user-details", userDetailsRoutes);
app.use("/api/admin-details", adminDetailsRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api", otpRoutes);


// Database Connection & Server Start
(async () => {
  try {
    // Instead of alter:true, use force:true in dev only when needed
    const isDev = process.env.NODE_ENV !== "production";

    await sequelize.sync({
      alter: false, // safer than alter:true
      force: false, // set true ONLY if you want to rebuild tables
    });

    console.log("✅ Database synced successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Database sync failed:", err.message);

    // Optional: More detailed info in development
    if (process.env.NODE_ENV !== "production") {
      console.error(err);
    }

    process.exit(1);
  }
})();
