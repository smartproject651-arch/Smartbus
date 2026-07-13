const Joi = require('joi');

exports.adminLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

exports.driverLoginSchema = Joi.object({
  driver_code: Joi.string().length(4).required(),
});