// routes/otpRoutes.js
const express = require("express");
const router = express.Router();
const { createSession, sendMessages, closeSession } = require("../sms");

// --------------------- OTP SMS Route ---------------------
router.post("/send-otp", async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ error: "Mobile number and OTP are required" });
  }

  try {
    const username = process.env.MOBITEL_USERNAME;
    const password = process.env.MOBITEL_PASSWORD;
    const alias = process.env.MOBITEL_ALIAS || "NITFB";

    const session = await createSession(username, password);
    if (!session) return res.status(500).json({ error: "Failed to create Mobitel session" });

    const message = `Your OTP code is: ${otp}`;
    const recipients = [mobile.replace("+94", "0")]; // Convert to 07XXXXXXXX format

    const response = await sendMessages(session, alias, message, recipients, 0);
    await closeSession(session);

    if (response) {
      return res.json({ success: true, message: "OTP sent successfully", response });
    } else {
      return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
  } catch (err) {
    console.error("Error sending OTP:", err.message);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

module.exports = router;
