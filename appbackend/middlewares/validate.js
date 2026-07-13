// Reusable validation middleware using Joi schemas
module.exports = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      const message = error.details.map(d => d.message).join(', ');
      return res.status(400).json({ error: message });
    }
    next();
  };
};