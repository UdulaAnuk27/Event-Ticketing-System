// backend/utils/sendSMS.js
const { createSession, sendMessages, closeSession } = require("../sms");

async function sendSMS(mobile, message) {
  try {
    const username = process.env.MOBITEL_USERNAME;
    const password = process.env.MOBITEL_PASSWORD;
    const alias = process.env.MOBITEL_ALIAS || "NITFB";

    const session = await createSession(username, password);
    const recipients = [mobile.replace("+94", "0")]; // 07XXXXXXXX format
    const response = await sendMessages(session, alias, message, recipients, 0);

    await closeSession(session);

    if (response) {
      console.log("✅ SMS sent to", mobile);
      return true;
    } else {
      console.warn("⚠️ SMS failed to send to", mobile);
      return false;
    }
  } catch (err) {
    console.error("⚠️ SMS error:", err.message);
    return false;
  }
}

module.exports = sendSMS;
