const router = require('express').Router();

const validator = require('../utils/validator');
const schemas = require('../schemas');
const auth = require('./auth');
const init = require('./init');
const events = require('./events');
const teams = require('./teams');
const results = require('./results');

const redirectIfLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect('/home');
  return next();
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.session.key.access === 9) return next();
  return res.redirect('/');
};

const authenticate = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/');
};

router.post(
  '/auth/register',
  validator(schemas.auth.register),
  auth.register
);
router.post('/auth/login', validator(schemas.auth.login), auth.login);
router.get('/auth/logout', auth.logout);
router.get('/init', init);
router.post(
  '/events/register',
  validator(schemas.events.register),
  events.register
);
router.post(
  '/events/unregister',
  validator(schemas.events.unregister),
  events.unregister
);
router.post(
  '/teams/create',
  validator(schemas.teams.create),
  teams.create
);
router.post(
  '/teams/members/add',
  validator(schemas.teams.addMember),
  teams.addMember
);
router.get(
  '/teams/members/:teamid',
  validator(schemas.teams.members),
  teams.members
);
router.get(
  '/teams/leave/:teamid',
  validator(schemas.teams.leave),
  teams.leave
);
router.post(
  '/results/record',
  // isAdmin,
  validator(schemas.results.recordResult),
  results.recordResult
);
router.post(
  '/results/update',
  // isAdmin,
  validator(schemas.results.updateResult),
  results.updateResult
);
module.exports = router;
