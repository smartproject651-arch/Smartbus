const { TripAssignment, LiveLocation, TripHistory, Issue, EmergencyAlert, Notification } = require('../models');
const snappingService = require('../services/snappingService');
const etaService = require('../services/etaService');
const logger = require('../utils/logger');

exports.getAssignedTrip = async (req, res, next) => {
  try {
    const driverId = req.driver.id;
    const today = new Date().toISOString().slice(0, 10);
    const trip = await TripAssignment.findOne({
      where: {
        driver_id: driverId,
        trip_date: today,
        status: { [require('sequelize').Op.or]: ['pending', 'active'] },
      },
      include: ['bus', 'route'],
    });
    if (!trip) return res.json({ message: 'No trip assigned', trip: null });
    res.json({ trip });
  } catch (err) { next(err); }
};

exports.startTrip = async (req, res, next) => {
  try {
    const { trip_id } = req.body;
    const trip = await TripAssignment.findOne({
      where: { id: trip_id, driver_id: req.driver.id, status: 'pending' },
    });
    if (!trip) return res.status(400).json({ error: 'Invalid trip or already started' });
    trip.status = 'active';
    trip.started_at = new Date();
    await trip.save();

    // Notify admin
    const io = req.app.get('io');
    io.to('admin').emit('trip-started', { tripId: trip.id, busNumber: trip.bus_id });
    await Notification.create({
      type: 'trip_started',
      message: `Trip ${trip.id} started by driver ${req.driver.driver_name}`,
      trip_id: trip.id,
    });

    res.json({ message: 'Trip started', trip });
  } catch (err) { next(err); }
};

exports.endTrip = async (req, res, next) => {
  try {
    const { trip_id } = req.body;
    const trip = await TripAssignment.findOne({
      where: { id: trip_id, driver_id: req.driver.id, status: 'active' },
    });
    if (!trip) return res.status(400).json({ error: 'No active trip found' });
    trip.status = 'completed';
    trip.ended_at = new Date();
    await trip.save();

    // Move to history
    await TripHistory.create({
      trip_assignment_id: trip.id,
      driver_id: trip.driver_id,
      bus_id: trip.bus_id,
      route_id: trip.route_id,
      started_at: trip.started_at,
      ended_at: trip.ended_at,
      // distance_covered and avg_speed could be calculated from live_locations
    });

    // Notify admin
    req.app.get('io').to('admin').emit('trip-ended', { tripId: trip.id });
    await Notification.create({
      type: 'trip_ended',
      message: `Trip ${trip.id} ended`,
      trip_id: trip.id,
    });

    res.json({ message: 'Trip ended successfully' });
  } catch (err) { next(err); }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const { trip_id, latitude, longitude, speed, heading } = req.body;
    const trip = await TripAssignment.findByPk(trip_id);
    if (!trip || trip.driver_id !== req.driver.id || trip.status !== 'active') {
      return res.status(400).json({ error: 'Invalid trip or not active' });
    }

    const snapResult = await snappingService.snapToRoute(trip.route_id, latitude, longitude);
    const loc = await LiveLocation.create({
      trip_id,
      latitude,
      longitude,
      speed,
      heading,
      snapped_lat: snapResult.snapped_lat,
      snapped_lng: snapResult.snapped_lng,
    });

    // Emit via Socket.IO
    const io = req.app.get('io');
    const locationData = {
      tripId: trip_id,
      busId: trip.bus_id,
      lat: snapResult.snapped_lat,
      lng: snapResult.snapped_lng,
      speed,
      heading,
      timestamp: new Date(),
    };
    io.to(`trip-${trip_id}`).emit('bus-location', locationData);
    io.to('admin').emit('bus-location', locationData);

    // Optionally calculate progress
    const progress = await etaService.calculateProgress(trip_id);
    io.to(`trip-${trip_id}`).emit('trip-progress', progress);
    io.to('admin').emit('trip-progress', { tripId: trip_id, ...progress });

    res.json({ success: true });
  } catch (err) { next(err); }
};

exports.reportIssue = async (req, res, next) => {
  try {
    const { trip_id, issue_type, description, latitude, longitude } = req.body;
    const trip = await TripAssignment.findByPk(trip_id);
    if (!trip || trip.driver_id !== req.driver.id) return res.status(400).json({ error: 'Invalid trip' });

    const issue = await Issue.create({
      trip_id,
      issue_type,
      description,
      latitude,
      longitude,
    });

    const io = req.app.get('io');
    io.to('admin').emit('new-issue', issue);
    await Notification.create({
      type: 'issue',
      message: `Issue reported: ${issue_type} on trip ${trip_id}`,
      trip_id,
    });

    res.status(201).json(issue);
  } catch (err) { next(err); }
};

exports.emergency = async (req, res, next) => {
  try {
    const { trip_id, latitude, longitude } = req.body;
    const trip = await TripAssignment.findByPk(trip_id);
    if (!trip || trip.driver_id !== req.driver.id) return res.status(400).json({ error: 'Invalid trip' });

    const alert = await EmergencyAlert.create({ trip_id, latitude, longitude });

    const io = req.app.get('io');
    io.to('admin').emit('new-emergency', alert);
    await Notification.create({
      type: 'emergency',
      message: `EMERGENCY! Driver ${req.driver.driver_name} on trip ${trip_id}`,
      trip_id,
    });

    res.status(201).json(alert);
  } catch (err) { next(err); }
};