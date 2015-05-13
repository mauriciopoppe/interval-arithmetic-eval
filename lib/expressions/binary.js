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
  '^': 'pow'
};

module.exports.eval = function (exp, next) {
  if (!operators[exp.operator]) {
    utils.error.notDefined(exp);
  }

  return '_I.' + operators[exp.operator] + '(' + next(exp.left) + ', ' + next(exp.right) + ')';
};

module.exports.test = function (exp) {
  return exp.type === 'BinaryExpression';
};
