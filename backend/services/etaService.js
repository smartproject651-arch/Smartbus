const { RoutePoint, BusStop, LiveLocation } = require('../models');

exports.calculateProgress = async (tripId) => {
  const trip = await require('../models').TripAssignment.findByPk(tripId, {
    include: ['route', 'bus'],
  });
  if (!trip) throw new Error('Trip not found');

  const routePoints = await RoutePoint.findAll({
    where: { route_id: trip.route_id },
    order: [['sequence', 'ASC']],
  });

  const lastLocation = await LiveLocation.findOne({
    where: { trip_id: tripId },
    order: [['timestamp', 'DESC']],
  });

  if (!lastLocation) {
    return { completedDistance: 0, remainingDistance: trip.Route.distance, completedStops: [], upcomingStops: [] };
  }

  // Find the index of the snapped point
  const snappedSeq = lastLocation.snapped_lat ? 
    routePoints.findIndex(p => 
      Math.abs(parseFloat(p.latitude) - parseFloat(lastLocation.snapped_lat)) < 0.0001 &&
      Math.abs(parseFloat(p.longitude) - parseFloat(lastLocation.snapped_lng)) < 0.0001
    ) : -1;

  const totalPoints = routePoints.length;
  let completedDistance = 0;

  if (snappedSeq > 0) {
    // Sum distances between consecutive points up to snappedSeq
    for (let i = 0; i < snappedSeq; i++) {
      const p1 = routePoints[i];
      const p2 = routePoints[i+1];
      completedDistance += haversine(
        parseFloat(p1.latitude), parseFloat(p1.longitude),
        parseFloat(p2.latitude), parseFloat(p2.longitude)
      );
    }
  }
  // remaining distance
  const totalDistance = trip.Route.distance;
  const remainingDistance = Math.max(0, totalDistance - completedDistance);

  // Determine completed/upcoming stops based on arrival_order vs snapped sequence
  const stops = await BusStop.findAll({
    where: { route_id: trip.route_id },
    order: [['arrival_order', 'ASC']],
  });
  let completedStops = [];
  let upcomingStops = [];
  // We need a mapping from stop coordinates to sequence; we'll approximate by sequence order
  // For a more accurate method, compare stop coordinates with route points.
  stops.forEach(stop => {
    const stopIdx = routePoints.findIndex(p => 
      Math.abs(parseFloat(p.latitude) - parseFloat(stop.latitude)) < 0.0001 &&
      Math.abs(parseFloat(p.longitude) - parseFloat(stop.longitude)) < 0.0001
    );
    if (stopIdx >= 0 && stopIdx <= snappedSeq) completedStops.push(stop);
    else upcomingStops.push(stop);
  });

  return { completedDistance, remainingDistance, completedStops, upcomingStops };
};

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}