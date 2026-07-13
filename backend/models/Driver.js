const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  driver_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  driver_code: {
    type: DataTypes.STRING(4),
    unique: true,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(15),
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
}, {
  tableName: 'drivers',
  timestamps: true,
  underscored: true,
});

module.exports = Driver;