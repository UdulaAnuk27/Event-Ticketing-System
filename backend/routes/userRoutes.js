const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDashboard,
  changePassword,
} = require("../controllers/userController");
const { verifyUser } = require("../middlewares/authMiddleware");

// 🔹 User Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyUser, logoutUser);

// 🔹 Protected Route (User Dashboard)
router.get("/dashboard", verifyUser, getUserDashboard);

// 🔹 Change Password (Protected)
router.put("/change-password", verifyUser, changePassword);

module.exports = router;
