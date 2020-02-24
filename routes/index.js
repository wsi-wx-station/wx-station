var express = require('express');
var wx = require('../lib/wx-data')
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let async_data = await wx.returnDummyData();
  res.render('index', async_data);
});

module.exports = router;
