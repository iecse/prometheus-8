// const fetch = require('node-fetch');

const uuid = require('uuid');
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const to = require('../utils/to');

exports.register = async (req, res) => {
  let err, result, salt, password;

  [err, salt] = await to(bcrypt.genSalt(10));
  if (err) return res.sendError(err);

  [err, password] = await to(bcrypt.hash(req.body.password, salt));
  if (err) return res.sendError(err);

  const qr = uuid();
  const userData = { ...req.body, password, qr };

  [err, result] = await to(db.query('INSERT INTO users SET ?', [userData]));
  if (err && err.code === 'ER_DUP_ENTRY')
    return res.sendError(null, 'Email alreay used', 409);
  if (err) return res.sendError(err);

  res.sendSuccess(null, 'Registration complete');
};

exports.login = async (req, res) => {
  let err, user, result;

  [err, user] = await to(
    db.query(
      `SELECT id, qr, name, email, password, mobile FROM users WHERE email = ?`,
      [req.body.email]
    )
  );
  if (err) return res.sendError(err);

  if (user.length === 0)
    return res.sendError(null, 'Invalid email/password combination');

  user = user[0];

  [err, result] = await to(bcrypt.compare(req.body.password, user.password));
  if (err) return res.sendError(err);
  if (!result) return res.sendError(null, 'Invalid email/password combination');

  user.password = undefined;
  delete user.password;

  req.session.key = user;
  req.session.save(() => {
    res.sendSuccess(user);
  });
};

exports.logout = (req, res) => {
  if (req.session.key)
    req.session.destroy(() => {
      res.sendSuccess(null, 'Logged out');
    });
  else res.sendSuccess(null, 'Logged out');
};
