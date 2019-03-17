const db = require('../config/database');
const to = require('../utils/to');

module.exports = async (req, res) => {
  if (req.session.key) {
    let err, events, registered, teams;

    [err, events] = await to(db.query('SELECT * FROM events'));
    if (err) return res.sendError(err);

    [err, registered] = await to(
      db.query('SELECT event FROM registrations WHERE user = ?', [
        req.session.key.id
      ])
    );
    if (err) return res.sendError(err);

    [err, teams] = await to(
      db.query(
        'SELECT id, event, name FROM teams JOIN team_members ON teams.id = team_members.team WHERE user = ?',
        [req.session.key.id]
      )
    );
    if (err) return res.sendError(err);

    res.sendSuccess({
      logged_in: true,
      user_data: req.session.key,
      events,
      registered: registered.map(data => data.event),
      teams
    });
  } else
    res.sendSuccess({
      logged_in: false
    });
};
