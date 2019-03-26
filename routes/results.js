const db = require('../config/database');
const to = require('../utils/to');

exports.recordResult = async (req, res) => {
    let err, result, userData;

    [err, userData] = await to(
        db.query(
            'SELECT * FROM users where qr = ?',
            [req.body.qr]
        )
    );
    if (userData.length === 0) return res.sendError('User not found');
    if (err) return res.sendError(err);

    [err, result] = await to(
        db.query(
            'SELECT teams.id FROM teams JOIN team_members ON teams.id = team_members.team WHERE teams.event = ? and team_members.user = ?',
            [req.body.event, userData[0].id]
        )
    );
    if (result.length === 0) return res.sendError('Team not found');
    if (err) return res.sendError(err);

    [err, result] = await to(
        db.query(
            'INSERT INTO results VALUES(?, ?, ?, ?)',
            [result[0].id, req.body.event, req.body.score, req.body.event]
        )
    );

    res.sendSuccess(result);
}

exports.updateResult = async (req, res) => {
    let err, result, userData;

    [err, result] = await to(
        db.query(
            'UPDATE results SET score = ? where team = ? AND event = ?',
            [req.body.score, req.body.team, req.body.event]
        )
    );
    if (err) return res.sendError(err);

    res.sendSuccess(result);
}
