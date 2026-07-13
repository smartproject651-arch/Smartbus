const jwt = require('jsonwebtoken');
const { Admin, Driver } = require('../models');
const env = require('../config/env');
const logger = require('../utils/logger');

exports.adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ where: { username } });
    if (!admin || !(await admin.validatePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin.id, role: admin.role }, env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, admin: { id: admin.id, username: admin.username, role: admin.role } });
  } catch (err) {
    next(err);
  }
};

exports.driverLogin = async (req, res, next) => {
  try {
    const { driver_code } = req.body;
    const driver = await Driver.findOne({ where: { driver_code, status: 'active' } });
    if (!driver) {
      return res.status(401).json({ error: 'Invalid driver code or inactive account' });
    }
    // Return driver id and code for future requests
    res.json({
      driver: {
        id: driver.id,
        driver_name: driver.driver_name,
        driver_code: driver.driver_code,
      },
    });
  } catch (err) {
    next(err);
  }
};