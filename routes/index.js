var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next) {
  console.log('here');
  var first = req.body.first;
  var second = req.body.second;
  res.send('success');
});

module.exports = router;
