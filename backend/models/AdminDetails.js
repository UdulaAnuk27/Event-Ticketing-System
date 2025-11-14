const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Admin = require("./Admin");

const AdminDetails = sequelize.define(
  "AdminDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Admin,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: { isEmail: true },
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "admin_details",
    timestamps: false,
  }
);

// Define associations
Admin.hasOne(AdminDetails, { foreignKey: "admin_id", as: "details" });
AdminDetails.belongsTo(Admin, { foreignKey: "admin_id", as: "admin" });

module.exports = AdminDetails;
