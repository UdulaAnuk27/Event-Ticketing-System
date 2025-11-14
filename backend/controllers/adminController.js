const Admin = require("../models/Admin");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendSMS = require("../utils/sendSMS");

// ===============================
// Register Admin
// ===============================
exports.registerAdmin = async (req, res) => {
  const { first_name, last_name, mobile, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { mobile } });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await Admin.create({
      first_name,
      last_name,
      mobile,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin.id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        mobile: admin.mobile,
        created_at: admin.created_at,
      },
    });
  } catch (err) {
    console.error("Admin registration error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===============================
// Login Admin
// ===============================
exports.loginAdmin = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    // Find admin by mobile
    const admin = await Admin.findOne({ where: { mobile } });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    // Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        mobile: admin.mobile,
        created_at: admin.created_at,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===============================
// Logout Admin
// ===============================
exports.logoutAdmin = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Admin logout error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===============================
// Get Admin Dashboard (Protected)
// ===============================
exports.getAdminDashboard = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { id: req.user.id },
      attributes: ["id", "first_name", "last_name", "mobile", "created_at"],
    });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    return res.status(200).json({
      admin,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===============================
// Get All Users (Admin Protected)
// ===============================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "first_name", "last_name", "mobile", "created_at"],
      order: [["created_at", "ASC"]],
    });

    return res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching all users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===============================
// Add User
// ===============================
exports.addUser = async (req, res) => {
  try {
    const { first_name, last_name, mobile, password } = req.body;

    if (!first_name || !last_name || !mobile || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to DB
    const user = await User.create({
      first_name,
      last_name,
      mobile,
      password: hashedPassword,
    });

    // ✅ Send SMS to the user
    // const message = `Dear Mr./Ms. ${first_name} ${last_name}, You have successfully registered to the Event Ticketing System. Please login to system using: Mobile Number: ${mobile} Password: ${password} Login: https://event-ticketing-system-pi.vercel.app/ Please change your password after your first login.`;
      const message = `Dear Mr. ${first_name} ${last_name}, You have already registered to the NITF System. You Agrahara Claim voucher is completed by slip. Please check your account balance`;

    sendSMS(mobile, message); // async, does not block response

    res.status(201).json({
      message: "User created successfully and SMS sent",
      user,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
};

// ===============================
// Update User
// ===============================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, mobile } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.first_name = first_name;
    user.last_name = last_name;
    user.mobile = mobile;

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// ===============================
// Delete User
// ===============================
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};

// ===============================
// Change Password (Protected)
// ===============================
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "New password and confirm password do not match" });
  }

  try {
    const admin  = await Admin .findOne({ where: { id: req.user.id } });
    if (!admin ) return res.status(404).json({ message: "Admin not found" });

    const match = await bcrypt.compare(oldPassword, admin .password);
    if (!match) return res.status(400).json({ message: "Old password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await admin .update({ password: hashedPassword });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};