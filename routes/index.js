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
  var matrix = editDistanceMatrix(first, second);
  printMatrix(matrix);
  res.render('index');
  //res.send('success');
});

function editDistanceMatrix(first, second) {
  // first = rows, second = columns
  var matrix = [...Array(second.length+2)].map(e => Array(first.length+2).fill(0));

  for (var i = 1; i < matrix.length; i++) {
    if (i == 1) {
      matrix[i][0] = '-';
    }
    if (i > 1) {
      matrix[i][0] = second[i-2];
    }
    matrix[i][1] = i-1;
  }
  
  for (var i = 1; i < matrix[0].length; i++) {
    if (i == 1) {
      matrix[0][i] = '-';
    }
    if (i > 1) {
      matrix[0][i] = first[i-2];
    }
    matrix[1][i] = i-1;
  }

  for (var i = 2; i < second.length+2; i++) {
    for (var j = 2; j < first.length+2; j++) {
      if (first[j-2] === second[i-2]) {
        matrix[i][j] = matrix[i-1][j-1];
      }
      else {
        matrix[i][j] = Math.min(matrix[i-1][j], matrix[i][j-1], matrix[i-1][j-1]) + 1;
      }
    }
  }
  return matrix;
  
}

function printMatrix(matrix) {
  // print matrix
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[0].length; j++) {
      process.stdout.write(matrix[i][j].toString());
    }
    process.stdout.write('\n');
  }
  process.stdout.write('END\n');
}

module.exports = router;
