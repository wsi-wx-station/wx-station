/* eslint-env mocha */
/* eslint no-sync: "off" */
'use strict';

const assert = require('assert').strict;
const fs = require('fs').promises;
const wx = require('../lib/wx-data');

const MOCK_API_DATA = `{"dateutc":1587318180000,"tempinf":66.6,"tempf":64.2,"humidityin":39,"humidity":20,"windspeedmph":0.2,"windgustmph":2.5,"maxdailygust":34.9,"winddir":287,"baromabsin":29.18,"baromrelin":29.75,"hourlyrainin":0,"dailyrainin":0,"weeklyrainin":0,"monthlyrainin":1.39,"yearlyrainin":8.52,"solarradiation":449.31,"uv":8,"feelsLike":64.2,"dewPoint":22.3,"feelsLikein":66.6,"dewPointin":40.9,"lastRain":"2020-04-17T21:54:00.000Z","tz":"America/Chicago","date":"2020-04-19T17:43:00.000Z","macAddress":"8C:18:D9:72:DB:CB","device":{"macAddress":"8C:18:D9:72:DB:CB","lastData":{"dateutc":1587318120000,"tempinf":66.6,"tempf":64.2,"humidityin":39,"humidity":21,"windspeedmph":0.2,"windgustmph":2.5,"maxdailygust":34.9,"winddir":195,"baromabsin":29.18,"baromrelin":29.74,"hourlyrainin":0,"dailyrainin":0,"weeklyrainin":0,"monthlyrainin":1.39,"yearlyrainin":8.52,"solarradiation":467.48,"uv":8,"feelsLike":64.2,"dewPoint":23.46,"feelsLikein":66.6,"dewPointin":40.9,"lastRain":"2020-04-17T21:54:00.000Z","deviceId":"5af1d16bc5f0cc0004d31618","tz":"America/Chicago","date":"2020-04-19T17:42:00.000Z"},"info":{"name":"Belmont Gardens","location":"Belmont Gardens"},"apiKey":"29963d911e194fdeab3dacd94a6cf4ecbf2cd0e8fcbe4e87838f0338ee5cce42"}}`;

describe('Write weather data to a file', function() {
  it('should save the data without error', async function() {
    let file = 'var/wx.tmp.json';
    let written = await wx.writeWeatherData(file, JSON.parse(MOCK_API_DATA));
    let read = await fs.readFile(file, 'utf8');
    assert.equal(typeof read, 'string');
    assert.equal(read,MOCK_API_DATA);
    await fs.unlink(file);
  });
});

describe('Prepared weather data', function() {
  let result = wx.prepareWeatherData(JSON.parse(MOCK_API_DATA), wx.WHITELIST);
  it('should have the same properties from the API data as the WHITELIST', function() {
    const properties = [];
    for (let key in result) {
      if (key[0] !== "_") { // ignore custom properties
        properties.push(key);
      }
    }
    assert.deepStrictEqual(wx.WHITELIST, properties);
  });
  it('should return a properly rounded temperature values', function() {
    assert.equal(result.tempf, 64);
    assert.equal(result.windspeedmph, 0);
    assert.equal(result.windgustmph, 3);
    assert.equal(result.dewPoint, 22);
    assert.equal(result.solarradiation, 449);
  });
  it('should return a properly formatted short date', function() {
    assert.equal(result._date.short, '4/19 12:43');
  });
  it('should return a small object for uv values', function() {
    assert.deepStrictEqual(result._uv, { class: 'v', index: 8, risk: 'Very High' });
  });
  it('should return a small object for wind direction', function() {
    assert.deepStrictEqual(result._wind, { deg: 287, direction: 'WNW' });
  });
});
