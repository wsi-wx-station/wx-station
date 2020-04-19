'use strict';
const fs = require('fs').promises;

async function writeWeatherData(file, data) {
  await fs.writeFile(file, JSON.stringify(data))
    .then(function(){
      console.log('Weather data written to file');
    })
    .catch(function(e){
      console.error(e);
    });
}

module.exports = { writeWeatherData };

// TODO: Move all of these functions into a shared library




function uvIndex(uv) {
  let risk;
  switch(uv) {
  case (uv > 10):
    risk = "Extreme";
    break;
  case (uv > 7):
    risk = "Very High";
    break;
  case (uv > 5):
    risk = "High";
    break;
  case (uv > 2):
    risk = "Moderate";
    break;
  default:
    risk = "Low";
  }
  return { index: uv, risk: risk, class: risk[0].toLowerCase() };
}

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
  // Form without template strings, for backward-compatible browser use
  // return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + zeroPad(d.getMinutes());
  return `${ d.getMonth()+1 }/${ d.getDate() } ${ d.getHours() }:${ zeroPad(d.getMinutes()) }`;
}

function cardinalDirection(deg) {
  const cardinals = [
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
