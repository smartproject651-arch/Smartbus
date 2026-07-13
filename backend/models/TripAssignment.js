const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TripAssignment = sequelize.define('TripAssignment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  driver_id: { type: DataTypes.INTEGER, allowNull: false },
  bus_id: { type: DataTypes.INTEGER, allowNull: false },
  route_id: { type: DataTypes.INTEGER, allowNull: false },
  trip_date: { type: DataTypes.DATEONLY, allowNull: false },
  shift: { type: DataTypes.ENUM('morning', 'evening', 'night'), defaultValue: 'morning' },
  status: { type: DataTypes.ENUM('pending', 'active', 'completed', 'cancelled'), defaultValue: 'pending' },
  started_at: DataTypes.DATE,
  ended_at: DataTypes.DATE,
}, { tableName: 'trip_assignments', underscored: true });

module.exports = TripAssignment;