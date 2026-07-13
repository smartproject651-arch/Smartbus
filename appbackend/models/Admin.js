const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('super', 'operator'), defaultValue: 'super' },
}, {
  tableName: 'admins',
  underscored: true,
  hooks: {
    beforeCreate: async (admin) => {
      admin.password_hash = await bcrypt.hash(admin.password_hash, 10);
    },
  },
});

Admin.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password_hash);
};

module.exports = Admin;