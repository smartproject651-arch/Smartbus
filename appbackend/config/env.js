require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 4000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASS: process.env.DB_PASS || 'Jayanth@17',
  DB_NAME: process.env.DB_NAME || 'where_is_my_bus',
  JWT_SECRET: process.env.JWT_SECRET || 'defaultsecret',
  OSRM_BASE_URL: process.env.OSRM_BASE_URL || 'http://router.project-osrm.org',
};

module.exports = env;