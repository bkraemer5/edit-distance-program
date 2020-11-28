var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next) {
  console.log('here');
  var first = (req.body.first).toUpperCase();
  var second = (req.body.second).toUpperCase();
  var matrix = editDistanceMatrix(first, second);
  alignment = getAlignment(first, second, matrix);
  printMatrix(matrix);
  getAlignment(first, second, matrix);
  res.render('result', { matrix: matrix , rows: matrix.length, cols: matrix[0].length, editDist: matrix[matrix.length-1][matrix[0].length-1], fAlign: alignment[0], sAlign: alignment[1] });
  //res.send('success');
});

function editDistanceMatrix(first, second) {
  // first = rows, second = columns
  var matrix = [...Array(second.length+2)].map(e => Array(first.length+2).fill(0));

  matrix[0][0] = ' ';

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

function getAlignment(first, second, matrix) {
  var row = matrix.length-1;
  var col = matrix[0].length-1;
  var alignment = ["", ""];
  var firstIndex = first.length-1;
  var secondIndex = second.length-1;
  while (firstIndex >= 0 && secondIndex >= 0) {
    // [insert, match, delete]
    var move = [matrix[row][col-1], matrix[row-1][col-1], matrix[row-1][col]]
    // match
    if (move[1] <= move[0] && move[1] <= move[2]) {
      alignment[0] = first[firstIndex].concat(alignment[0]);
      alignment[1] = second[secondIndex].concat(alignment[1]);
      firstIndex--;
      secondIndex--;
      row -= 1;
      col -= 1;
    }
    // delete
    else if (move[2] < move[1] && move[2] < move[0]) {
      alignment[0] = "_".concat(alignment[0]);
      alignment[1] = second[secondIndex].concat(alignment[1]);
      secondIndex--;
      row -=1;
    }
    // insert
    else if (move[0] < move[1] && move[0] < move[2]) {
      alignment[0] = first[firstIndex].concat(alignment[0]);
      alignment[1] = "_".concat(alignment[1]);
      firstIndex--;
      col -= 1;
    }
  }
  while(firstIndex >= 0) {
    alignment[0] = first[firstIndex].concat(alignment[0]);
    alignment[1] = "_".concat(alignment[1]);
    firstIndex--;
  } 
  while(secondIndex >= 0) {
    alignment[0] = "_".concat(alignment[0]);
    alignment[1] = second[secondIndex].concat(alignment[1]);
    secondIndex--;
  }

  return alignment;
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
