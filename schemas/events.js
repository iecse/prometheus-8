const Joi = require('joi');

const register = Joi.object({
  body: Joi.object({
    event: Joi.number()
      .integer()
      .required()
  }).required()
});

const unregister = Joi.object({
  body: Joi.object({
    event: Joi.number()
      .integer()
      .required()
  }).required()
});

module.exports = {
  register,
  unregister
};
