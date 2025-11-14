const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Event = require("./Event");
const User = require("./User");

const Booking = sequelize.define(
  "Booking",
  {
    booking_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: "event_id",
      },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    tickets_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    booking_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "bookings",
    timestamps: false,
  }
);

// Associations
Booking.belongsTo(Event, { foreignKey: "event_id", as: "event" });
Event.hasMany(Booking, { foreignKey: "event_id", as: "bookings" });

Booking.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Booking, { foreignKey: "user_id", as: "bookings" });

module.exports = Booking;
