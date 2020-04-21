'use strict';
const fs = require('fs').promises;

const WHITELIST = [
  'tempf',
  'humidity',
  'windspeedmph',
  'windgustmph',
  'winddir',
  'dailyrainin',
  'solarradiation',
  'uv',
  'dewPoint',
  'date'
];

async function writeWeatherData(file, data) {
  await fs.writeFile(file, JSON.stringify(data))
    .then(function(){
      console.log('Weather data written to file');
      return true;
    })
    .catch(function(e){
      console.error(e);
      return false;
    });
}

function cardinalDirection(deg) {
  const cardinals = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'
  ];
  return cardinals[Math.round(deg / 22.5)];
}

function returnWhitelistedDataPoints(data,whitelist) {
  for (let data_point in data) {
    if (!whitelist.includes(data_point) && data.hasOwnProperty(data_point)) {
        delete data[data_point]
    }
  }
  return data;
}

function prepareWeatherData(raw_data,whitelist = WHITELIST) {
  // Parse the raw data and strip the unneccessary properties from the data object
  let data = returnWhitelistedDataPoints(raw_data,whitelist);
  // set date value as a short date
  data._date = shortDate(data.date)
  // round values with unnecessary decimals
  data = batchRound(data,['tempf','windspeedmph','windgustmph','dewPoint','solarradiation']);
  // set _uv value as a small object
  data._uv = uvIndexValues(data.uv);
  // set _wind value as a small object
  data._wind = windValues(data.winddir);
  // return the prepared weather data object
  return data;
}

function batchRound(object,values) {
  for (let val of values) {
    object[val] = Math.round(object[val]);
  }
  return object;
}

function shortDate(d) {
  const now = new Date(d);
  let hours = now.getHours();
  let merid = 'am';
  // Form without template strings, for backward-compatible browser use
  // return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + zeroPad(d.getMinutes());
  if (hours > 12) {
    hours = hours - 12;
    merid = 'pm';
  }
  return { timestamp: d, short: `${ now.getMonth()+1 }/${ now.getDate() } ${ hours }:${ zeroPad(now.getMinutes()) } ${ merid }` };
}

function uvIndexValues(uv) {
  let risk;
  switch(true) {
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

function windValues(wind) {
  return { deg: wind, direction: cardinalDirection(wind) };
}

// Non-exported utility functions

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


module.exports = {
  WHITELIST,
  writeWeatherData,
  prepareWeatherData
};
