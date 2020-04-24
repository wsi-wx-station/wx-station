/** @file An ExpressJS app to capture and display Ambient Weather API data.
* @author Karl Stolley <karl.stolley@gmail.com>
* @copyright Karl Stolley
* @license
* Copyright 2020 by Karl Stolley
*
* Permission to use, copy, modify, and/or distribute this software for any purpose with or without
* fee is hereby granted, provided that the above copyright notice and this permission notice appear
* in all copies.
*
* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
* SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE
* AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
* NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
* OF THIS SOFTWARE.
*/

'use strict';

const AWApi = require('ambient-weather-api');
const createError = require('http-errors');
const EventEmitter = require('events');
const express = require('express');
const fs = require('fs').promises;
const indexRouter = require('./routes/index');
const io = require('socket.io')();
const logger = require('morgan');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const wx = require('./lib/wx-data');


// Ambient Weather API Setup
const apiKey = process.env.AMBIENT_WEATHER_USER_KEY;
const api = new AWApi({
  apiKey: apiKey,
  applicationKey: process.env.AMBIENT_WEATHER_APP_KEY
});

/** Custom weather-event emitter that connects the API with web sockets.
* @class WxEmitter
* @extends EventEmitter
*/
class WxEmitter extends EventEmitter {}
/** Instance of WxEmitter
* @const {WxEmitter}
*/
const wxEmitter = new WxEmitter();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true,
  precision: 9
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


api.connect();

// Reconnect every 10 minutes
setInterval(function(aw_api){
  aw_api.disconnect();
  aw_api.connect();
  aw_api.subscribe(apiKey);
}, 600000, api);

api.on('connect', function() {
  console.log('Connected to the Ambient Weather API');
});

api.on('disconnect', function() {
  console.log('Disconnected from the Ambient Weather API');
});

api.subscribe(apiKey);
api.on('subscribed', function(ddata) {
  const data = ddata.devices[0].lastData;
  wx.writeWeatherData('var/wx.json', data);
});

api.on('data', function(data){
  const raw_data = {};
  Object.freeze(data); // freeze the original data from the API
  Object.assign(raw_data, data); // make a clone of the data for manipulation
  const prepared_data = wx.prepareWeatherData(raw_data, wx.WHITELIST);
  wxEmitter.emit('weather', prepared_data);
  wx.writeWeatherData('var/wx.json', data);
});

io.on('connection', function(socket){
  // TODO: this data is intended for browsers that *re*-connect. Need to
  // investigate whether this is the best way to handle that case.
  fs.readFile('var/wx.json')
    .then(function(data) {
      const wx_data = wx.prepareWeatherData(JSON.parse(data), wx.WHITELIST);
      socket.emit('weather', wx_data);
    });
  wxEmitter.on('weather', function(data) {
    socket.emit('weather', data);
  });
});

module.exports = {app, io};
