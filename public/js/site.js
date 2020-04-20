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

socket.on('weather', function(data) {
  var simple_properties = ['tempf','dailyrainin','windgustmph','windspeedmph','dewPoint','humidity','solarradiation'];
  var date = document.querySelector('#date');
  var wind = document.querySelector('#winddir');
  var uv = document.querySelector('#uv');
  var uv_risk = document.querySelector('#uv-risk');
  // Run through and roughly update the innerText of all simple elements
  for (var i = 0; i < simple_properties.length; i++) {
    document.querySelector('#'+simple_properties[i]).innerText = data[simple_properties[i]];
  }
  // Handle the more complicated elements manually
  // TODO: shortDate() should return an object with the short date and timestamp
  date.innerText = data._date.short;
  date.timestamp = data._date.timestamp;
  wind.innerText = data._wind.direction;
  wind.dataset.winddir = data._wind.deg;
  uv.innerText = data._uv.index;
  uv.className = data._uv.class;
  uv_risk.innerText = data._uv.risk;
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
