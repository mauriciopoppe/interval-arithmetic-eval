/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
var number = require('../raw/number');

module.exports.eval = function (next, exp) {
  return '_I.pow(' + next(exp.left) + ', ' + number.eval(next, exp.right) + ')';
};

module.exports.test = function (exp) {
  return exp.type === 'BinaryExpression' && exp.operator === '^';
};
