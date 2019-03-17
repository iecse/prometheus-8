const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const redisStore = require('./config/redis')(session);
const routes = require('./routes');
const responseFormat = require('./utils/responseFormat');
const sessionSecret = require('./config/session').secret;

const app = express();

app.use(logger('dev'));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: sessionSecret,
    store: redisStore,
    cookie: { maxAge: 604800000 }
  })
);
app.use(express.static('public'));
app.use(cookieParser('secret'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(responseFormat);

app.use('/api', routes);

const port = process.env.PORT || 3000;

app.listen(port, err => {
  console.log(err || 'Listening on port ' + port);
});
