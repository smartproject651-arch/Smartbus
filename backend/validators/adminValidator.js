const Joi = require('joi');

exports.createDriverSchema = Joi.object({
  driver_name: Joi.string().max(100).required(),
  phone: Joi.string().max(15).optional(),
});

exports.createBusSchema = Joi.object({
  bus_number: Joi.string().max(20).required(),
  registration_number: Joi.string().max(20).required(),
  capacity: Joi.number().integer().optional(),
  type: Joi.string().valid('city', 'ac', 'volvo').default('city'),
});

exports.createRouteSchema = Joi.object({
  route_name: Joi.string().max(100).required(),
  source: Joi.string().max(100).required(),
  destination: Joi.string().max(100).required(),
});

exports.generateRouteSchema = Joi.object({
  startLat: Joi.number().min(-90).max(90).required(),
  startLng: Joi.number().min(-180).max(180).required(),
  endLat: Joi.number().min(-90).max(90).required(),
  endLng: Joi.number().min(-180).max(180).required(),
});

exports.createStopSchema = Joi.object({
  stop_name: Joi.string().max(100).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  arrival_order: Joi.number().integer().required(),
});

exports.assignTripSchema = Joi.object({
  driver_id: Joi.number().integer().required(),
  bus_id: Joi.number().integer().required(),
  route_id: Joi.number().integer().required(),
  trip_date: Joi.date().iso().required(),
  shift: Joi.string().valid('morning', 'evening', 'night').default('morning'),
});