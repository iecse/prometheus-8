const router = require('express').Router();

const validator = require('../utils/validator');
const schemas = require('../schemas');
const auth = require('./auth');
const init = require('./init');
const events = require('./events');
const teams = require('./teams');

const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.key) return res.redirect('/events');
  return next();
};

const authenticate = (req, res, next) => {
  if (req.session.key) return next();
  return res.redirect('/auth');
};

// Check if the user's email is verified
const userIsVerified = (req, res, next) => {
  if (req.session.key.active !== 1)
    return res.sendError(null, 'Please verify your Email first', 401);
  return next();
}

router.post(
  '/auth/register',
  validator(schemas.auth.register),
  auth.register
);
router.post(
  '/auth/login',
  validator(schemas.auth.login),
  auth.login
);
router.get(
  '/auth/logout',
  authenticate,
  auth.logout
);
router.get(
  '/auth/verifyUser',
  auth.verifyEmail
);
router.get(
  '/init',
  authenticate,
  init
);
router.post(
  '/events/register',
  authenticate,
  userIsVerified,
  validator(schemas.events.register),
  events.register
);
router.post(
  '/events/unregister',
  authenticate,
  userIsVerified,
  validator(schemas.events.unregister),
  events.unregister
);
router.post(
  '/teams/create',
  authenticate,
  userIsVerified,
  validator(schemas.teams.create),
  teams.create
);
router.post(
  '/teams/members/add',
  authenticate,
  userIsVerified,
  validator(schemas.teams.addMember),
  teams.addMember
);
router.get(
  '/teams/members/:teamid',
  authenticate,
  validator(schemas.teams.members),
  teams.members
);
router.get(
  '/teams/leave/:teamid',
  authenticate,
  userIsVerified,
  validator(schemas.teams.leave),
  teams.leave
);

module.exports = router;
