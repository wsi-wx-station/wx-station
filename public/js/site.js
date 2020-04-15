/* global io */
'use strict';

var socket = io.connect('/');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function(registration) {
      console.log('Registered a service worker scoped to', registration.scope);
    })
    .catch(function(error) {
      console.error('Failed to register service worker', error);
    });
}

socket.on('news', function(data){
  console.log(data.greet);
  socket.emit('backactcha', { dude: "I am socketed up, brah"});
});
socket.on('weather', function(data) {
  var date = document.querySelector('#date');
  var tempf = document.querySelector('#tempf');
  var winddir = document.querySelector('#winddir');
  var windspeedmph = document.querySelector('#windspeedmph');

  date.innerText = shortDate(data.date);
  date.dateTime = data.date;
  tempf.innerText = data.tempf;
  winddir.innerText = cardinalDirection(data.winddir);
  winddir.dataset.winddir = data.winddir;
  windspeedmph.innerText = data.windspeedmph;

});

fetch('https://api.weather.gov/gridpoints/LOT/71,75/forecast')
  .then(function(response) {
    return response.json();
  })
  .then(function(data){
    var aside = document.createElement('aside');
    var forecast = document.createElement('p');
    var heading = document.createElement('h3');
    aside.id = 'forecast';
    heading.innerText = data.properties.periods[0].name;
    forecast.innerText = data.properties.periods[0].detailedForecast;
    aside.appendChild(heading);
    aside.appendChild(forecast);
    document.querySelector('.temperature').appendChild(aside);
  });

// TODO: Consolidate these utility functions with those on the server side;
// decide whether these need to remain in the client, or can be handled with
// the prepareData(); function on the server side

function zeroPad(num, length) {
  if (typeof length === 'undefined') {
    length = 2;
  }
  num = num.toString();
  while (num.length < length) {
    num = '0' + num;
  }
  return num;
}

function shortDate(d) {
  d = new Date(d);
  // return `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${zeroPad(d.getMinutes())}`;
  return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + zeroPad(d.getMinutes());
}

function cardinalDirection(deg) {
  var cardinals = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
    'N'
  ];
  return cardinals[Math.round(deg / 22.5)];
}
