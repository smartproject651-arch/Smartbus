const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: {
    type: DataTypes.ENUM('emergency', 'issue', 'trip_started', 'trip_ended'),
    allowNull: false,
  },
  message: DataTypes.TEXT,
  trip_id: DataTypes.INTEGER,
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'notifications', underscored: true, timestamps: false });

module.exports = Notification;