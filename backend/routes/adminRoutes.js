const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminDashboard,
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controllers/adminController");
const { verifyAdmin } = require("../middlewares/authMiddleware");

// 🔹 Admin Authentication Routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", verifyAdmin, logoutAdmin);

// 🔹 Protected Routes (Admin Only)
router.get("/dashboard", verifyAdmin, getAdminDashboard);
router.get("/users", verifyAdmin, getAllUsers);
router.post("/users", verifyAdmin, addUser);
router.put("/users/:id", verifyAdmin, updateUser);
router.delete("/users/:id", verifyAdmin, deleteUser);

// 🔹 Change Password (Protected)
router.put("/change-password", verifyAdmin, changePassword);

module.exports = router;
