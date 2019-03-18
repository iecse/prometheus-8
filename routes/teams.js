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
  let err, result, teams;

  [err, result] = await to(
    db.query(
      'SELECT * FROM teams JOIN events ON events.id = teams.event JOIN team_members ON team_members.team = teams.id WHERE teams.id = ?',
      [req.body.team]
    )
  );
  if (err) return res.sendError(err);
  if (result.length === 0)
    return res.sendError(null, 'Team does not exit', 404);
  const data = result[0];
  if (result.length >= data.max_size)
    return res.sendError(null, 'Team full', 409);
  let flag = false;
  result.forEach(a => {
    if (a.qr === req.body.qr) flag = true;
  });
  if (flag) return res.sendError(null, 'User already part of team', 409);

  [err, result] = await to(
    db.query(
      'SELECT * FROM users JOIN registrations ON users.id = registrations.user WHERE qr = ? and event = ?',
      [req.body.qr, data.event]
    )
  );
  if (err) return res.sendError(err);
  if (result.length === 0)
    return res.sendError(null, 'User has not registered for this event', 404);
  const user = result[0].id;

  [err, teams] = await to(
    db.query(
      'SELECT * FROM teams JOIN team_members ON teams.id = team_members.team WHERE team_members.user = ?',
      [user]
    )
  );
  if (err) return res.sendError(err);
  flag = false;
  teams.forEach(a => {
    if (a.event === data.event) flag = true;
  });
  if (flag) return res.sendError(null, 'User is a part of another team', 409);

  [err, teams] = await to(
    db.query('INSERT INTO team_members SET ?', [{ user, team: req.body.team }])
  );
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
