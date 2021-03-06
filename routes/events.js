const db = require('../config/database');
const to = require('../utils/to');

exports.register = async (req, res) => {
  const registrationData = { ...req.body, user: req.session.key.id };

  let [err, result] = await to(
    db.query('INSERT INTO registrations SET ?', [registrationData])
  );
  if (err && err.code === 'ER_DUP_ENTRY')
    return res.sendError(null, 'Already registered', 409);
  if (err) return res.sendError(err);

  res.sendSuccess(null, 'Registration complete');
};

exports.unregister = async (req, res) => {
  let err, result;

  [err, result] = await to(
    db.query(
      'SELECT id FROM teams JOIN team_members ON teams.id = team_members.team WHERE event = ? and user = ?',
      [req.body.event, req.session.key.id]
    )
  );
  if (result.length > 0)
    return res.sendError(null, 'Please leave your team first', 409);
  if (err) return res.sendError(err);

  [err, result] = await to(
    db.query('DELETE FROM registrations WHERE user = ? and event = ?', [
      req.session.key.id,
      req.body.event
    ])
  );
  if (err) return res.sendError(err);

  res.sendSuccess(null, 'Unregistered');
};
