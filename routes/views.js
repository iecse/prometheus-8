const router = require('express').Router();
const path = require('path');

const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.key) return res.redirect('/events');
  return next();
};

const authenticate = (req, res, next) => {
  if (req.session.key) return next();
  return res.redirect('/auth');
};

router.get('/', (req, res) =>
  res.sendFile('index.html', { root: path.join(__dirname, '../views') })
);

router.get('/auth', redirectIfLoggedIn, (req, res) =>
  res.sendFile('auth.html', { root: path.join(__dirname, '../views') })
);

router.get('/events', authenticate, (req, res) =>
  res.sendFile('events.html', { root: path.join(__dirname, '../views') })
);

module.exports = router;
