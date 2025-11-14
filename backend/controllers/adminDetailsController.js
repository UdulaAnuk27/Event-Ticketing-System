const Admin = require("../models/Admin");
const AdminDetails = require("../models/AdminDetails");
const fs = require("fs");
const path = require("path");

// GET admin details
exports.getAdminDetails = async (req, res) => {
  try {
    const adminId = req.user.id;

    const admin = await Admin.findByPk(adminId, {
      attributes: ["id", "first_name", "last_name", "mobile", "created_at"],
      include: [
        {
          model: AdminDetails,
          as: "details",
          attributes: ["id", "email", "profile_image", "date_of_birth", "address", "created_at"],
        },
      ],
    });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const profileImage = admin.details?.profile_image
      ? `${req.protocol}://${req.get("host")}/uploads/admin_profile_pictures/${admin.details.profile_image}`
      : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

    res.status(200).json({
      message: "Admin details fetched successfully",
      admin: {
        id: admin.id,
        first_name: admin.first_name,
        last_name: admin.last_name,
        mobile: admin.mobile,
        details: {
          email: admin.details?.email || "",
          profile_image: profileImage,
          date_of_birth: admin.details?.date_of_birth || null,
          address: admin.details?.address || "",
        },
      },
    });
  } catch (err) {
    console.error("Get admin details error:", err);
    res.status(500).json({ message: "Failed to fetch admin details" });
  }
};

// CREATE or UPDATE admin details
exports.updateAdminDetails = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { first_name, last_name, email, date_of_birth, address } = req.body;

    // Update Admin table (first_name, last_name)
    const admin = await Admin.findByPk(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    await admin.update({ first_name, last_name });

    let details = await AdminDetails.findOne({ where: { admin_id: adminId } });

    // Handle uploaded admin profile image
    let profile_image;
    if (req.file) {
      profile_image = req.file.filename;

      // Delete old profile image if exists
      if (details?.profile_image) {
        const oldPath = path.join(__dirname, "../uploads/admin_profile_pictures", details.profile_image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    if (!details) {
      details = await AdminDetails.create({
        admin_id: adminId,
        email,
        profile_image,
        date_of_birth,
        address,
      });
    } else {
      const updateData = { email, date_of_birth, address };
      if (profile_image) updateData.profile_image = profile_image;
      await details.update(updateData);
    }

    const fullProfileImage = details.profile_image
      ? `${req.protocol}://${req.get("host")}/uploads/admin_profile_pictures/${details.profile_image}`
      : null;

    res.status(200).json({
      message: "Admin details updated successfully",
      admin: {
        first_name: admin.first_name,
        last_name: admin.last_name,
        details: {
          email: details.email,
          profile_image: fullProfileImage,
          date_of_birth: details.date_of_birth,
          address: details.address,
        },
      },
    });
  } catch (err) {
    console.error("Update admin details error:", err);
    res.status(500).json({ message: "Failed to update admin details" });
  }
};

// DELETE admin details
exports.deleteAdminDetails = async (req, res) => {
  try {
    const adminId = req.user.id;
    const details = await AdminDetails.findOne({ where: { admin_id: adminId } });

    if (!details) return res.status(404).json({ message: "Admin details not found" });

    // Delete profile image from server
    if (details.profile_image) {
      const imgPath = path.join(__dirname, "../uploads/admin_profile_pictures", details.profile_image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await details.destroy();
    res.status(200).json({ message: "Admin details deleted successfully" });
  } catch (err) {
    console.error("Delete admin details error:", err);
    res.status(500).json({ message: "Failed to delete admin details" });
  }
};
