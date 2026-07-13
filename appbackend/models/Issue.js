const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Issue = sequelize.define('Issue', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  trip_id: { type: DataTypes.INTEGER, allowNull: false },
  issue_type: {
    type: DataTypes.ENUM('accident', 'mechanical_failure', 'heavy_traffic', 'tyre_puncture', 'road_block', 'other'),
    allowNull: false,
  },
  description: DataTypes.TEXT,
  latitude: DataTypes.DECIMAL(10,7),
  longitude: DataTypes.DECIMAL(10,7),
  status: { type: DataTypes.ENUM('open', 'resolved'), defaultValue: 'open' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'issues', underscored: true, timestamps: false });

module.exports = Issue;