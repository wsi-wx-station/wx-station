'use strict';

const createError = require('http-errors');
const express = require('express');
const fs = require('fs').promises;
const io = require('socket.io')();
const path = require('path');
const EventEmitter = require('events');
// No need to load up cookies
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const indexRouter = require('./routes/index');

const app = express();

// Ambient Weather API
const AWApi = require('ambient-weather-api');

const apiKey = process.env.AMBIENT_WEATHER_USER_KEY;

const api = new AWApi({
  apiKey: apiKey,
  applicationKey: process.env.AMBIENT_WEATHER_APP_KEY
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
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
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Set up custom event emitter
// to wire up API data with web sockets

class WxEmitter extends EventEmitter {}
const wxEmitter = new WxEmitter();


api.connect();
api.on('connect', function() {
  console.log('Connected to the Ambient Weather API');
});

api.on('subscribed', function(ddata) {
  // TODO: better prepare the weather data
  // var prepared_data = prepareData(ddata.devices[0].lastData);
  // fs.writeFile('var/wx.json', JSON.stringify(prepared_data))
  const data = ddata.devices[0].lastData;
  // TODO: write a function to encapsulate this logic, shared also with the
  // api 'data' event below
  fs.writeFile('var/wx.json', JSON.stringify(data))
    .then(function(){
      console.log('Weather data written to file');
    })
    .catch(function(e){
      console.error(e);
    });
});

api.on('data', function(data){
  wxEmitter.emit('weather', data);
  fs.writeFile('var/wx.json', JSON.stringify(data))
    .then(function(){
      console.log('Weather data written to file');
    })
    .catch(function(e){
      console.error(e);
    });
});

api.subscribe(apiKey);

io.on('connection', function(socket){
  socket.emit('news', { greet: 'Hello, world!'});
  socket.on('backactcha', function(data) {
    console.log(data);
  });
  wxEmitter.on('weather', function(data) {
    // TODO: better prepare the weather data
    // const prepared_data = prepareData(data);
    // socket.emit('weather', prepared_data);
    socket.emit('weather', data);
  });
});

module.exports = {app, io};
