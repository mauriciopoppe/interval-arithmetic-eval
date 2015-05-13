/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
var Interval = require('interval-arithmetic');

module.exports.eval = function (exp, next) {
  if (Interval[exp.name]) {
    return '_I.' + exp.name;
  }
  if (Interval[exp.name.toUpperCase()]) {
    return '_I.' + exp.name.toUpperCase();
  }
  // defaults to scope if not found on interval-arithmetic
  return 'utils.castLiteral(_I, scope.' + exp.name + ')';
};

module.exports.test = function (exp) {
  return exp.type === 'Identifier';
};
