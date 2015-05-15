/**
 * Created by mauricio on 5/14/15.
 */
'use strict';

module.exports = function (next, exp) {
  var condition = '!!(' + next(exp.condition) + ')';
  var trueExpr = next(exp.trueExpr);
  var falseExpr = next(exp.falseExpr);
  return '(' + condition + ' ? (' + trueExpr + ') : (' + falseExpr + ') )';
};
