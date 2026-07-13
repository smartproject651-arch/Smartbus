const { Server } = require('socket.io');
const driverHandler = require('./driverHandler');
const adminHandler = require('./adminHandler');

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('track-bus', (tripId) => {
      socket.join(`trip-${tripId}`);
      console.log(`Client joined room trip-${tripId}`);
    });

    socket.on('stop-tracking', (tripId) => {
      socket.leave(`trip-${tripId}`);
    });

    socket.on('admin-join', () => {
      socket.join('admin');
      console.log('Admin joined admin room');
    });

    driverHandler(io, socket);
    adminHandler(io, socket);

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  });

  return io;
};