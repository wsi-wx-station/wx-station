'use strict';

const express = require('express');
const fs = require('fs').promises;
const wx = require('../lib/wx-data')
const router = express.Router();

/* GET home page. */
router.get('/', async function(req, res) {
  // TODO: simplify the reading & parsing of JSON to a single line
  try {
    const wx_json = await fs.readFile('var/wx.json');
    const wx_data = wx.prepareWeatherData(JSON.parse(wx_json), wx.WHITELIST);
    console.log(JSON.stringify(wx_data));
    res.render('index', wx_data);
  } catch(e) {
    console.error(e);
  };
});

module.exports = router;
