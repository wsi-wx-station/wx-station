var createError = require('http-errors');
var express = require('express');
var fs = require('fs').promises;
var server = require('http').Server();
var io = require('socket.io')(server);
var path = require('path');
var EventEmitter = require('events');
// No need to load up cookies
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');

var app = express();

// Ambient Weather API
const AWApi = require('ambient-weather-api');

const apiKey = process.env.AMBIENT_WEATHER_USER_KEY;

const api = new AWApi({
  apiKey: apiKey,
  applicationKey: process.env.AMBIENT_WEATHER_APP_KEY
});

// Set socket server to listen on :3001
server.listen(3001);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
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

// Set up custom event emitter
// to wire up API data with web sockets

class WxEmitter extends EventEmitter {}
var wxEmitter = new WxEmitter();


api.connect();
api.on('connect', function() {
  console.log('Connected to the Ambient Weather API');
});

api.on('subscribed', function(ddata) {
  // console.log(data.devices[0].lastData);
  var data = ddata.devices[0].lastData;
  //console.log(`At ${shortDate(data.date)} - ${data.tempf}℉, wind out of the ${cardinalDirection(data.winddir)} at ${data.windspeedmph} mph`);
  fs.writeFile('var/wx.json', JSON.stringify(data))
    .then(function(){
      console.log('Weather data written to file');
    })
    .catch(function(e){
      console.error(e);
    });
});

api.on('data', function(data){
  //console.log(`At ${shortDate(data.date)} - ${data.tempf}℉, wind out of the ${cardinalDirection(data.winddir)} at ${data.windspeedmph} mph`);
  wxEmitter.emit('weather', data);
});

api.subscribe(apiKey);

io.on('connection', function(socket){
  socket.emit('news', { greet: 'Hello, world!'});
  socket.on('backactcha', function(data) {
    console.log(data);
  });
  wxEmitter.on('weather', function(data) {
    socket.emit('weather', data);
  });
});

module.exports = app;
