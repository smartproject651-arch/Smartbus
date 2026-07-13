const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Bus = sequelize.define('Bus', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bus_number: { type: DataTypes.STRING(20), allowNull: false },
  registration_number: { type: DataTypes.STRING(20), unique: true, allowNull: false },
  capacity: DataTypes.INTEGER,
  type: { type: DataTypes.ENUM('city', 'ac', 'volvo'), defaultValue: 'city' },
  status: { type: DataTypes.ENUM('active', 'inactive', 'maintenance'), defaultValue: 'active' },
}, { tableName: 'buses', underscored: true });

module.exports = Bus;