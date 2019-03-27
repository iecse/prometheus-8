const fetch = require('node-fetch');
const path = require('path');

const uuid = require('uuid');
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const to = require('../utils/to');

exports.register = async (req, res) => {
  let err, result, salt, password;

  // Verify Captcha
  let captchaToken = req.body.captcha;
  req.body.captcha = null;
  delete req.body.captcha;
  [err, result] = await to(
    fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${
        process.env.RECAPTCHA_SECRET
      }&response=${captchaToken}`
    )
  );
  if (err) return res.sendError(err);

  [err, result] = await to(result.json());
  if (err) return res.sendError(err);

  if (result.success != true) {
    console.log(result);
    return res.sendError(err);
  }

  // Create user in table
  [err, salt] = await to(bcrypt.genSalt(10));
  if (err) return res.sendError(err);

  [err, password] = await to(bcrypt.hash(req.body.password, salt));
  if (err) return res.sendError(err);

  const qr = uuid();
  const token = uuid(); // Mailed to user for email verification
  const userData = { ...req.body, password, qr, token };

  [err, result] = await to(db.query('INSERT INTO users SET ?', [userData]));
  if (err && err.code === 'ER_DUP_ENTRY')
    return res.sendError(null, 'Email already used', 409);
  if (err) return res.sendError(err);

  // Send verification mail
  [err, result] = await to(
    fetch('https://mail.iecsemanipal.com/prom/emailVerification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.MAILER_KEY
      },
      body: JSON.stringify({ toEmail: req.body.email, token })
    })
  );
  if (err) {
    console.log('Error', err);
    return res.sendError(err);
  }
  [err, result] = await to(result.json());
  if (err) {
    console.log(err);
    return res.sendError(err);
  }

  if (result.success != true) {
    return res.sendError();
  }

  res.sendSuccess(null, 'Verification Email has been sent');
};

exports.verifyEmail = async (req, res) => {
  // Validate query params
  if (!req.query['token'] || !req.query['email'])
    return res.sendError(null, 'Bad Request', 400);

  // Fetch user and compare tokens
  [err, result] = await to(
    db.query('SELECT * FROM users WHERE email = ?', [req.query['email']])
  );
  if (err) return res.sendError(err);
  if (result.length === 0) return res.sendError(null, 'User not found', 404);

  if (result[0].token !== req.query['token'])
    return res.sendError(null, 'Invalid Token', 400);

  // Activate account if tokens match
  [err, result] = await to(
    db.query('UPDATE users SET active = 1 where email = ?', [
      req.query['email']
    ])
  );
  if (err) return res.sendError(err);

  // Modify current session to verify user
  // while keeping them logged in and redirect
  // to portal
  req.session.key.active = 1;
  res.redirect('/auth');
};

exports.login = async (req, res) => {
  let err, user, result;

  [err, user] = await to(
    db.query(
      `SELECT id, qr, name, email, password, mobile, active FROM users WHERE email = ?`,
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
      res.redirect('/auth');
    });
  else res.redirect('/auth');
};
