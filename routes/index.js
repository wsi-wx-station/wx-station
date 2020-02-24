var express = require('express');
var wxData = require('../lib/wx-data');

var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  wxData.helloThere();
  let data = await wxData.gitHubData();
  res.render('index', data);
});

module.exports = router;
