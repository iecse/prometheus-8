const Joi = require('joi');

const register = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .max(200)
      .required(),
    email: Joi.string()
      .email()
      .max(200)
      .required(),
    password: Joi.string()
      .max(200)
      .required(),
    mobile: Joi.string()
      .max(200)
      .required(),
    captcha: Joi.string()
      .required()
  }).required()
});

const login = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .email()
      .max(200)
      .required(),
    password: Joi.string()
      .max(200)
      .required()
  }).required()
});

module.exports = {
  register,
  login
};
