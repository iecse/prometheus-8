const Joi = require('joi');

const create = Joi.object({
  body: Joi.object({
    event: Joi.number()
      .integer()
      .required(),
    name: Joi.string()
      .max(200)
      .required()
  }).required()
});

module.exports = {
  create
};
