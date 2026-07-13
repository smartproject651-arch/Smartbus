const { RoutePoint } = require('../models');

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

exports.snapToRoute = async (routeId, rawLat, rawLng) => {
  const points = await RoutePoint.findAll({
    where: { route_id: routeId },
    order: [['sequence', 'ASC']],
    attributes: ['id', 'latitude', 'longitude', 'sequence'],
  });

  if (!points || points.length === 0) {
    return { snapped_lat: rawLat, snapped_lng: rawLng, sequence: -1, point_id: null };
  }

  let minDist = Infinity;
  let closest = points[0];
  for (const p of points) {
    const d = haversine(rawLat, rawLng, parseFloat(p.latitude), parseFloat(p.longitude));
    if (d < minDist) {
      minDist = d;
      closest = p;
    }
  }

  return {
    snapped_lat: parseFloat(closest.latitude),
    snapped_lng: parseFloat(closest.longitude),
    sequence: closest.sequence,
    point_id: closest.id,
  };
};