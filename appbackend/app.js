const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models');
const env = require('./config/env');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const driverRoutes = require('./routes/driver');
const passengerRoutes = require('./routes/passenger');

// Import error handler
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/passenger', passengerRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handling
app.use(errorHandler);

// Database sync and start
const PORT = env.PORT;

async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');
    // In production, use migrations; for dev, sync can create tables
    await sequelize.sync({ alter: true }); // careful in production, use migrations
    logger.info('Database synced');
  } catch (err) {
    logger.error('Database connection failed:', err);
    process.exit(1);
  }
}

module.exports = { app, startServer };