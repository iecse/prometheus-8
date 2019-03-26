const Joi = require('joi');

const recordResult = Joi.object({
    body: Joi.object({
        qr: Joi.string()
            .required(),
        event: Joi.number()
            .integer()
            .required(),
        score: Joi.number()
            .integer()
            .required(),
        round: Joi.number()
            .integer()
            .required()
    }).required()
});

const updateResult = Joi.object({
    body: Joi.object({
        event: Joi.number()
            .integer()
            .required(),
        score: Joi.number()
            .integer()
            .required(),
        team : Joi.number()
            .integer()
            .required()
    }).required()
});

module.exports = {
    recordResult,
    updateResult
};
