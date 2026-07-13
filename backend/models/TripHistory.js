const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TripHistory = sequelize.define('TripHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  trip_assignment_id: { type: DataTypes.INTEGER, allowNull: false },
  driver_id: { type: DataTypes.INTEGER, allowNull: false },
  bus_id: { type: DataTypes.INTEGER, allowNull: false },
  route_id: { type: DataTypes.INTEGER, allowNull: false },
  started_at: { type: DataTypes.DATE, allowNull: false },
  ended_at: { type: DataTypes.DATE, allowNull: false },
  distance_covered: DataTypes.DECIMAL(10,2),
  avg_speed: DataTypes.DECIMAL(5,2),
}, { tableName: 'trip_history', underscored: true });

module.exports = TripHistory;