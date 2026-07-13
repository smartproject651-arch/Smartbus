const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Route = sequelize.define('Route', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  route_name: { type: DataTypes.STRING(100), allowNull: false },
  source: { type: DataTypes.STRING(100), allowNull: false },
  destination: { type: DataTypes.STRING(100), allowNull: false },
  distance: { type: DataTypes.DECIMAL(10,2), comment: 'kilometers' },
  duration: { type: DataTypes.INTEGER, comment: 'minutes' },
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
}, { tableName: 'routes', underscored: true });

module.exports = Route;