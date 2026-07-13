const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RoutePoint = sequelize.define('RoutePoint', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  route_id: { type: DataTypes.INTEGER, allowNull: false },
  latitude: { type: DataTypes.DECIMAL(10,7), allowNull: false },
  longitude: { type: DataTypes.DECIMAL(10,7), allowNull: false },
  sequence: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'route_points', underscored: true, timestamps: false });

module.exports = RoutePoint;