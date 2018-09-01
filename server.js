'use strict';

const dbsetup = require('./db');
dbsetup.connect();

const express = require('express'),
  app = express(),
  config = require('./config'),
  bodyParser = require('body-parser'),
  helmet = require('helmet');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

// Sets "X-Content-Type-Options: nosniff".
app.use(helmet.noSniff());
// Sets "X-XSS-Protection: 1; mode=block".
app.use(helmet.xssFilter());

app.use(helmet.hidePoweredBy());

app.use(require('./controllers'));

const server = app.listen(config.port, function () {
  console.log(`Server listening at port ${server.address().port}`);
});

module.exports = server;
