const jwt = require('jsonwebtoken');
const { Admin, Driver } = require('../models');
const env = require('../config/env');

exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id);
    if (!admin) throw new Error();
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Not authorized as admin' });
  }
};

exports.driverAuth = async (req, res, next) => {
  try {
    const driverId = req.header('x-driver-id');
    const driverCode = req.header('x-driver-code');
    if (!driverId || !driverCode) throw new Error();
    const driver = await Driver.findByPk(driverId);
    if (!driver || driver.driver_code !== driverCode) {
      throw new Error();
    }
    if (driver.status !== 'active') {
      return res.status(403).json({ error: 'Driver account is inactive' });
    }
    req.driver = driver;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid driver credentials' });
  }
};