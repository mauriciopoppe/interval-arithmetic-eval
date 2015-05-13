/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
var utils = require('../utils');

var operators = {
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  '/': 'div',
  '%': 'fmod'
};

module.exports.eval = function (next, exp) {
  return '_I.' + operators[exp.operator] + '(' + next(exp.left) + ', ' + next(exp.right) + ')';
};

module.exports.test = function (exp) {
  return exp.type === 'BinaryExpression' && operators[exp.operator];
};
