const { Driver, Bus, Route, RoutePoint, BusStop, TripAssignment, TripHistory, EmergencyAlert, Issue, Notification } = require('../models');
const osrmService = require('../services/osrmService');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

// ---- Drivers ----
exports.getDrivers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Driver.findAndCountAll({
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });
    res.json({ total: count, page: parseInt(page), data: rows });
  } catch (err) { next(err); }
};

exports.createDriver = async (req, res, next) => {
  try {
    const { driver_name, phone } = req.body;
    // Generate unique 4-digit code
    let code;
    do {
      code = Math.floor(1000 + Math.random() * 9000).toString();
    } while (await Driver.findOne({ where: { driver_code: code } }));
    const driver = await Driver.create({ driver_name, phone, driver_code: code });
    res.status(201).json(driver);
  } catch (err) { next(err); }
};

exports.updateDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { driver_name, phone, status } = req.body;
    const driver = await Driver.findByPk(id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    await driver.update({ driver_name, phone, status });
    res.json(driver);
  } catch (err) { next(err); }
};

exports.deleteDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findByPk(id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    await driver.destroy();
    res.json({ message: 'Driver deleted' });
  } catch (err) { next(err); }
};

// ---- Buses ----
exports.getBuses = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Bus.findAndCountAll({ limit: parseInt(limit), offset });
    res.json({ total: count, page: parseInt(page), data: rows });
  } catch (err) { next(err); }
};

exports.createBus = async (req, res, next) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json(bus);
  } catch (err) { next(err); }
};

exports.updateBus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findByPk(id);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    await bus.update(req.body);
    res.json(bus);
  } catch (err) { next(err); }
};

exports.deleteBus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findByPk(id);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    await bus.destroy();
    res.json({ message: 'Bus deleted' });
  } catch (err) { next(err); }
};

// ---- Routes (blueprint) ----
exports.getRoutes = async (req, res, next) => {
  try {
    const routes = await Route.findAll({ include: ['points', 'stops'] });
    res.json(routes);
  } catch (err) { next(err); }
};

exports.generateRoute = async (req, res, next) => {
  try {
    const { startLat, startLng, endLat, endLng } = req.body;
    const { distance, duration, points } = await osrmService.getRoute(startLat, startLng, endLat, endLng);
    // We need source/destination names — for now we'll use coordinates, admin will update
    const route = await Route.create({
      route_name: `Route ${Date.now()}`,
      source: `${startLat},${startLng}`,
      destination: `${endLat},${endLng}`,
      distance,
      duration,
    });
    const routePoints = points.map((p, idx) => ({
      route_id: route.id,
      latitude: p.latitude,
      longitude: p.longitude,
      sequence: idx,
    }));
    await RoutePoint.bulkCreate(routePoints);
    // Return route with points
    const fullRoute = await Route.findByPk(route.id, { include: ['points'] });
    res.status(201).json(fullRoute);
  } catch (err) { next(err); }
};

exports.updateRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { route_name, source, destination } = req.body;
    const route = await Route.findByPk(id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    await route.update({ route_name, source, destination });
    res.json(route);
  } catch (err) { next(err); }
};

exports.deleteRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const route = await Route.findByPk(id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    await route.destroy(); // cascade will remove points/stops
    res.json({ message: 'Route deleted' });
  } catch (err) { next(err); }
};

// ---- Bus Stops ----
exports.addStop = async (req, res, next) => {
  try {
    const { route_id } = req.params;
    const { stop_name, latitude, longitude, arrival_order } = req.body;
    const route = await Route.findByPk(route_id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    const stop = await BusStop.create({ route_id: parseInt(route_id), stop_name, latitude, longitude, arrival_order });
    res.status(201).json(stop);
  } catch (err) { next(err); }
};

exports.getStops = async (req, res, next) => {
  try {
    const { route_id } = req.params;
    const stops = await BusStop.findAll({ where: { route_id }, order: [['arrival_order', 'ASC']] });
    res.json(stops);
  } catch (err) { next(err); }
};

exports.deleteStop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stop = await BusStop.findByPk(id);
    if (!stop) return res.status(404).json({ error: 'Stop not found' });
    await stop.destroy();
    res.json({ message: 'Stop deleted' });
  } catch (err) { next(err); }
};

// ---- Trip Assignments ----
exports.getTrips = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const where = {};
    if (status) where.status = status;
    if (date) where.trip_date = date;
    const trips = await TripAssignment.findAll({
      where,
      include: [
        { model: Driver, as: 'driver' },
        { model: Bus, as: 'bus' },
        { model: Route, as: 'route' },
      ],
      order: [['trip_date', 'DESC']],
    });
    res.json(trips);
  } catch (err) { next(err); }
};

exports.assignTrip = async (req, res, next) => {
  try {
    const { driver_id, bus_id, route_id, trip_date, shift } = req.body;
    // Validate driver, bus, route exist
    const driver = await Driver.findByPk(driver_id);
    const bus = await Bus.findByPk(bus_id);
    const route = await Route.findByPk(route_id);
    if (!driver || !bus || !route) {
      return res.status(404).json({ error: 'Driver/Bus/Route not found' });
    }
    const trip = await TripAssignment.create({ driver_id, bus_id, route_id, trip_date, shift });
    res.status(201).json(trip);
  } catch (err) { next(err); }
};

exports.cancelTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await TripAssignment.findByPk(id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.status === 'active') return res.status(400).json({ error: 'Cannot cancel active trip' });
    await trip.update({ status: 'cancelled' });
    res.json(trip);
  } catch (err) { next(err); }
};

// ---- Dashboard ----
exports.dashboardStats = async (req, res, next) => {
  try {
    const totalDrivers = await Driver.count({ where: { status: 'active' } });
    const totalBuses = await Bus.count({ where: { status: 'active' } });
    const runningTrips = await TripAssignment.count({ where: { status: 'active' } });
    const completedTrips = await TripHistory.count();
    const activeAlerts = await EmergencyAlert.count({ where: { resolved: false } });
    const openIssues = await Issue.count({ where: { status: 'open' } });
    res.json({ totalDrivers, totalBuses, runningTrips, completedTrips, activeAlerts, openIssues });
  } catch (err) { next(err); }
};

exports.recentTrips = async (req, res, next) => {
  try {
    const trips = await TripAssignment.findAll({
      limit: 10,
      order: [['started_at', 'DESC']],
      include: ['driver', 'bus', 'route'],
    });
    res.json(trips);
  } catch (err) { next(err); }
};