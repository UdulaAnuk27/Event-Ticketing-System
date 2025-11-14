const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Base upload folder
const baseUploadDir = path.join(__dirname, "../uploads");

// Ensure folder exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "others";

    switch (file.fieldname) {
      case "profile_image":          // For user profile
        folder = "profile_pictures";
        break;
      case "admin_profile_image":    // For admin profile
        folder = "admin_profile_pictures";
        break;
      case "event_image":            // For event uploads
        folder = "event_images";
        break;
    }

    const uploadPath = path.join(baseUploadDir, folder);
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Use the original file name exactly as uploaded
    cb(null, file.originalname);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;
