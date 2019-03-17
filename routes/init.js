module.exports = (req, res) => {
  if (req.session.key) {
    res.sendSuccess({
      logged_in: true,
      user_data: req.session.key
    });
  } else
    res.sendSuccess({
      logged_in: false
    });
};
