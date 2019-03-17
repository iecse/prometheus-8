const router = require('express').Router();

const validator = require('../utils/validator');

const redirectIfLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect('/home');
  return next();
};

const authenticate = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/');
};

module.exports = router;
