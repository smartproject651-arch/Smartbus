const axios = require('axios');
const env = require('../config/env');

exports.getRoute = async (startLat, startLng, endLat, endLng) => {
  const url = `${env.OSRM_BASE_URL}/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
  const response = await axios.get(url);
  if (!response.data.routes || response.data.routes.length === 0) {
    throw new Error('No route found');
  }
  const route = response.data.routes[0];
  const points = route.geometry.coordinates.map(coord => ({
    latitude: coord[1],
    longitude: coord[0],
  }));
  return {
    distance: route.distance / 1000, // km
    duration: route.duration / 60,   // minutes
    points,
  };
};