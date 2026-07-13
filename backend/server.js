const http = require('http');
const { app, startServer } = require('./app');
const socketSetup = require('./socket');
const env = require('./config/env');
const logger = require('./utils/logger');

const server = http.createServer(app);

// Attach Socket.IO
const io = socketSetup(server);
app.set('io', io);

startServer().then(() => {
  server.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
});