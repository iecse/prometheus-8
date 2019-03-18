const Joi = require('joi');

const create = Joi.object({
  body: Joi.object({
    event: Joi.number()
      .integer()
      .required(),
    name: Joi.string()
      .max(200)
      .min(3)
      .required()
  }).required()
});

const addMember = Joi.object({
  body: Joi.object({
    qr: Joi.string().required(),
    team: Joi.number()
      .integer()
      .required()
  }).required()
});

const members = Joi.object({
  params: Joi.object({
    teamid: Joi.number()
      .integer()
      .required()
  }).required()
});

const leave = Joi.object({
  params: Joi.object({
    teamid: Joi.number()
      .integer()
      .required()
  }).required()
});

module.exports = {
  create,
  members,
  leave,
  addMember
};
