const express = require("express");
const router = express.Router();
const {
  getAdminDetails,
  updateAdminDetails,
  deleteAdminDetails,
} = require("../controllers/adminDetailsController");
const { verifyAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", verifyAdmin, getAdminDetails);
router.put("/update", verifyAdmin, upload.single("admin_profile_image"), updateAdminDetails);
router.delete("/delete", verifyAdmin, deleteAdminDetails);

module.exports = router;
