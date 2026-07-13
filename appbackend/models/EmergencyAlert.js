const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmergencyAlert = sequelize.define('EmergencyAlert', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  trip_id: { type: DataTypes.INTEGER, allowNull: false },
  latitude: DataTypes.DECIMAL(10,7),
  longitude: DataTypes.DECIMAL(10,7),
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  resolved: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'emergency_alerts', underscored: true, timestamps: false });

module.exports = EmergencyAlert;