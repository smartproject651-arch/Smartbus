module.exports = (io, socket) => {
  // Driver location update can also be sent directly via socket (if not using REST)
  socket.on('driver-location-update', (data) => {
    // data: { tripId, lat, lng, speed, heading }
    // We'll assume the REST endpoint stores it and also emits, but we can also relay here
    io.to(`trip-${data.tripId}`).emit('bus-location', data);
    io.to('admin').emit('bus-location', data);
  });
};