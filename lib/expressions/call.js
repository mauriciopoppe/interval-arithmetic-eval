/**
 * Created by mauricio on 5/12/15.
 */
'use strict';

module.exports.eval = function (next, exp) {
  var res;
  // parse next literal
  res = next(exp.callee) + '(';
  for (var i = 0; i < exp.arguments.length; i += 1) {
    if (i) { res += ', '; }
    res += next(exp.arguments[i]);
  }
  res += ')';
  return res;
};

module.exports.test = function (exp) {
  return exp.type === 'CallExpression';
};