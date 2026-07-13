const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BusStop = sequelize.define('BusStop', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  route_id: { type: DataTypes.INTEGER, allowNull: false },
  stop_name: { type: DataTypes.STRING(100), allowNull: false },
  latitude: { type: DataTypes.DECIMAL(10,7), allowNull: false },
  longitude: { type: DataTypes.DECIMAL(10,7), allowNull: false },
  arrival_order: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'bus_stops', underscored: true, timestamps: false });

module.exports = BusStop;