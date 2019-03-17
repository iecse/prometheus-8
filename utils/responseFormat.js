const moment = require('moment');
module.exports = (req, res, next) => {
  let body = {};
  if (req.body) {
    body = { ...req.body };
    if (body.password) {
      body.password = null;
      delete body.password;
    }
  }
  console.log({
    time: moment().format('LLLL'),
    path: req.path,
    ...(!!Object.keys(req.body).length && { body: JSON.stringify(body) }),
    ...(!!Object.keys(req.query).length && { query: req.query }),
    ...(!!Object.keys(req.params).length && { params: req.params }),
    ...(!!Object.keys(req.session).length && { session: req.session.key })
  });
  res.sendError = (err, msg = 'Internal server error', status = 500) => {
    err && console.log('[ERROR] ', err);
    if (msg) console.log(msg);
    res.status(status).send({ success: false, msg });
  };
  res.sendSuccess = (data, msg, status = 200) => {
    if (msg) console.log(msg);
    res.status(status).send({ success: true, msg, ...(data && { data }) });
  };
  next();
};
