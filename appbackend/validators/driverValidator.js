const Joi = require('joi');

exports.startTripSchema = Joi.object({
  trip_id: Joi.number().integer().required(),
});

exports.updateLocationSchema = Joi.object({
  trip_id: Joi.number().integer().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  speed: Joi.number().min(0).optional(),
  heading: Joi.number().min(0).max(360).optional(),
});

exports.reportIssueSchema = Joi.object({
  trip_id: Joi.number().integer().required(),
  issue_type: Joi.string().valid('accident', 'mechanical_failure', 'heavy_traffic', 'tyre_puncture', 'road_block', 'other').required(),
  description: Joi.string().optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
});

exports.emergencySchema = Joi.object({
  trip_id: Joi.number().integer().required(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
});