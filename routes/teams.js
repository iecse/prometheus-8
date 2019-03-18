const db = require('../config/database');
const to = require('../utils/to');

exports.create = async (req, res) => {
  let err, result;

  [err, result] = await to(
    db.query(
      'SELECT id FROM teams JOIN team_members ON teams.id = team_members.team WHERE event = ? and user = ?',
      [req.body.event, req.session.key.id]
    )
  );
  if (result.length > 0)
    return res.sendError(null, 'You are already part of a team', 409);
  if (err) return res.sendError(err);

  [err, result] = await to(
    db.query('SELECT * FROM registrations WHERE event = ? and user = ?', [
      req.body.event,
      req.session.key.id
    ])
  );
  if (result.length === 0)
    return res.sendError(null, 'Not registered for this event', 404);
  if (err) return res.sendError(err);

  [err, result] = await to(db.query('INSERT INTO teams SET ?', [req.body]));
  if (err && err.code === 'ER_DUP_ENTRY')
    return res.sendError(null, 'Team name taken', 409);
  if (err) return res.sendError(err);

  const teamMemberData = { team: result.insertId, user: req.session.key.id };
  [err, result] = await to(
    db.query('INSERT INTO team_members SET ?', [teamMemberData])
  );
  if (err && err.code === 'ER_DUP_ENTRY')
    return res.sendError(err, 'Team name taken', 409);
  if (err) return res.sendError(err);

  res.sendSuccess({ name: req.body.name }, 'Team created');
};

exports.addMember = async (req, res) => {
  let err, result;

  [err, result] = await to(
    db.query('SELECT id FROM registrations WHERE user = ?', [
      req.session.key.id
    ])
  );
  if (result.length === 0)
    return res.sendError(null, 'You are not registered for this event', 404);
  if (err) return res.sendError(err);

  [err, result] = await to(
    db.query(
      'SELECT id FROM users JOIN registrations ON users.id = registrations.user WHERE qr = ?',
      [req.body.qr]
    )
  );
  if (result.length === 0)
    return res.sendError(null, 'User is not registered for this event', 404);
  if (err) return res.sendError(err);

  const memberId = result[0].id;

  [err, result] = await to(
    db.query(
      'SELECT id FROM teams JOIN team_members ON teams.id = team_members.team WHERE event = ? and user = ?',
      [req.body.event, memberId]
    )
  );
  if (result.length > 0)
    return res.sendError(null, 'User is already part of a team', 409);
  if (err) return res.sendError(err);

  [err, result] = await to(
    db.query(
      'SELECT id FROM teams JOIN team_members ON teams.id = team_members.team WHERE event = ? and user = ?',
      [req.body.event, req.session.key.id]
    )
  );
  if (result.length === 0) return res.sendError(null, 'Team not found', 404);
  if (err) return res.sendError(err);

  const teamMemberData = { team: result[0].id, user: memberId };

  [err, result] = await to(
    db.query(
      'SELECT * FROM teams JOIN team_members ON teams.id = team_members.team JOIN events ON teams.event = events.id WHERE teams.id = ?',
      [teamMemberData.team]
    )
  );
  if (result.length >= 0 && result.length >= result[0].max_size)
    return res.sendError(null, 'Team full', 409);
  if (err) return res.sendError(err);

  [err, result] = await to(
    db.query('INSERT INTO team_members SET ?', [teamMemberData])
  );
  if (err && err.code === 'ER_DUP_ENTRY')
    return res.sendError(err, 'User is already a part of this team', 409);
  if (err) return res.sendError(err);

  res.sendSuccess(null, 'Team member added');
};

exports.members = async (req, res) => {
  let err, result;

  [err, result] = await to(
    db.query(
      'SELECT name, id FROM users JOIN team_members ON users.id = team_members.user WHERE team_members.team = ?',
      [req.params.teamid]
    )
  );
  if (err) return res.sendError(err);

  if (result.length === 0)
    return res.sendError(null, 'Team does not exist', 404);

  if (result.filter(data => data.id === req.session.key.id).length === 0)
    return res.sendError(null, 'You are not a part of this team', 409);

  res.sendSuccess(result);
};

exports.leave = async (req, res) => {
  let err, result;

  [err, result] = await to(
    db.query('DELETE FROM team_members WHERE user = ? AND team = ?', [
      req.session.key.id,
      req.params.teamid
    ])
  );
  if (err) return res.sendError(err);

  [err, result] = await to(
    db.query('SELECT * FROM team_members WHERE team = ?', [req.params.teamid])
  );
  if (err) return res.sendError(err);

  if (result.length === 0) {
    [err, result] = await to(
      db.query('DELETE FROM teams WHERE id = ?', [req.params.teamid])
    );
    if (err) return res.sendError(err);
  }

  res.sendSuccess(null, 'Left the team');
};
