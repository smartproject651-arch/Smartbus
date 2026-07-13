const { Op } = require('sequelize');
const { TripAssignment, LiveLocation, Route, RoutePoint, BusStop, Bus } = require('../models');
const { calculateProgress } = require('../services/etaService');

exports.searchByBusNumber = async (req, res, next) => {
  try {
    const { busNumber } = req.params;
    const bus = await Bus.findOne({ where: { bus_number: busNumber, status: 'active' } });
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    const activeTrip = await TripAssignment.findOne({
      where: { bus_id: bus.id, status: 'active' },
      include: ['route', 'driver'],
    });
    if (!activeTrip) return res.json({ message: 'Bus not currently on a trip', bus, trip: null });
    const lastLoc = await LiveLocation.findOne({
      where: { trip_id: activeTrip.id },
      order: [['timestamp', 'DESC']],
    });
    const progress = await calculateProgress(activeTrip.id);
    res.json({ bus, trip: activeTrip, location: lastLoc, progress });
  } catch (err) { next(err); }
};

exports.nearbyBuses = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5 } = req.query; // radius in km
    // Find active trips and check their last location distance (simplified: DB query for all active)
    const activeTrips = await TripAssignment.findAll({
      where: { status: 'active' },
      include: ['bus', 'route'],
    });
    const results = [];
    for (const trip of activeTrips) {
      const lastLoc = await LiveLocation.findOne({
        where: { trip_id: trip.id },
        order: [['timestamp', 'DESC']],
      });
      if (lastLoc) {
        const dist = haversine(parseFloat(lat), parseFloat(lng), parseFloat(lastLoc.latitude), parseFloat(lastLoc.longitude));
        if (dist <= radius) {
          results.push({
            tripId: trip.id,
            bus: trip.bus,
            route: trip.route,
            lastLocation: lastLoc,
            distance: dist,
          });
        }
      }
    }
    res.json(results);
  } catch (err) { next(err); }
};

exports.trackBus = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await TripAssignment.findByPk(tripId, { include: ['bus', 'route', 'driver'] });
    if (!trip || trip.status !== 'active') return res.status(404).json({ error: 'Trip not active' });
    const location = await LiveLocation.findOne({
      where: { trip_id: tripId },
      order: [['timestamp', 'DESC']],
    });
    const progress = await calculateProgress(tripId);
    // Also return route geometry for map
    const points = await RoutePoint.findAll({
      where: { route_id: trip.route_id },
      order: [['sequence', 'ASC']],
    });
    res.json({ trip, location, progress, routePoints: points });
  } catch (err) { next(err); }
};

exports.searchRoutes = async (req, res, next) => {
  try {
    const { from, to } = req.query; // format "lat,lng"
    if (!from || !to) return res.status(400).json({ error: 'from and to query params required' });
    const [fromLat, fromLng] = from.split(',').map(Number);
    const [toLat, toLng] = to.split(',').map(Number);
    // Simple approach: find routes whose source/destination bounding boxes cover both points
    // Better: use spatial query or match via route_points. For now, list all active routes and check if they contain both points.
    const routes = await Route.findAll({ where: { status: 'active' }, include: ['points'] });
    const matched = [];
    for (const route of routes) {
      const pts = route.points;
      if (pts.length < 2) continue;
      const fromDist = pts.map(p => haversine(fromLat, fromLng, parseFloat(p.latitude), parseFloat(p.longitude))).min();
      const toDist = pts.map(p => haversine(toLat, toLng, parseFloat(p.latitude), parseFloat(p.longitude))).min();
      if (fromDist < 0.5 && toDist < 0.5) { // within 500m
        const activeTrips = await TripAssignment.findAll({
          where: { route_id: route.id, status: 'active' },
          include: ['bus'],
        });
        matched.push({ route, activeTrips });
      }
    }
    res.json(matched);
  } catch (err) { next(err); }
};

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}