/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
var utils = require('../utils');
var number = require('../raw/number');

module.exports.eval = function (next, exp) {
  var arr = '[';
  for (var i = 0; i < exp.elements.length; i += 1) {
    if (i) { arr += ', '; }
    // array elements don't use the normal interpreter,
    // only numbers are allowed here
    arr += number.eval(next, exp.elements[i]);
  }
  arr += ']';
  return 'utils.castInterval(_I, ' + arr + ')';
};

module.exports.test = function (exp) {
  return exp.type === 'ArrayExpression';
};
