// backend/sms.js
const soap = require("soap");

const WSDL_URL = "https://msmsenterpriseapi.mobitel.lk/mSMSEnterpriseAPI/mSMSEnterpriseAPI.wsdl";

async function createSession(username, password) {
  try {
    const client = await soap.createClientAsync(WSDL_URL, { trace: true });
    const args = { user: { id: "", username, password, customer: "" } };
    const [result] = await client.createSessionAsync(args);

    console.log("🔹 SOAP createSession response:", result);

    if (!result || !result.return) {
      throw new Error("Failed to create Mobitel session");
    }

    return result.return;
  } catch (err) {
    console.error("❌ SOAP createSession error:", err);
    throw err;
  }
}

async function sendMessages(session, alias, message, recipients, messageType = 0) {
  try {
    const client = await soap.createClientAsync(WSDL_URL);
    const args = {
      session,
      smsMessage: {
        message,
        messageId: "",
        recipients,
        retries: "",
        sender: alias,
        messageType,
        sequenceNum: "",
        status: "",
        time: "",
        type: "",
        user: "",
      },
    };
    const [result] = await client.sendMessagesAsync(args);
    return result.return;
  } catch (err) {
    console.error("❌ SOAP sendMessages error:", err.message);
    throw err;
  }
}

async function closeSession(session) {
  try {
    const client = await soap.createClientAsync(WSDL_URL);
    await client.closeSessionAsync({ session });
  } catch (err) {
    console.error("❌ SOAP closeSession error:", err.message);
  }
}

module.exports = { createSession, sendMessages, closeSession };
