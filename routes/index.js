var express = require('express');
var fs = require('fs').promises;
var wx = require('../lib/wx-data')
var router = express.Router();

function shortDate(d) {
  d = new Date(d);
  return `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
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


/* GET home page. */
router.get('/', async function(req, res, next) {
  let wx_json = await fs.readFile('var/wx.json');
  let wx_data = JSON.parse(wx_json);
  wx_data.shortDate = shortDate(wx_data.date);
  wx_data.cardinalDirection = cardinalDirection(wx_data.winddir);
  res.render('index', wx_data);
});

module.exports = router;
