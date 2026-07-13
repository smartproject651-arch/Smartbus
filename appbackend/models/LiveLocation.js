const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LiveLocation = sequelize.define('LiveLocation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  trip_id: { type: DataTypes.INTEGER, allowNull: false },
  latitude: { type: DataTypes.DECIMAL(10,7), allowNull: false },
  longitude: { type: DataTypes.DECIMAL(10,7), allowNull: false },
  speed: DataTypes.DECIMAL(5,2),
  heading: DataTypes.DECIMAL(5,2),
  snapped_lat: DataTypes.DECIMAL(10,7),
  snapped_lng: DataTypes.DECIMAL(10,7),
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'live_locations', underscored: true, timestamps: false });

module.exports = LiveLocation;