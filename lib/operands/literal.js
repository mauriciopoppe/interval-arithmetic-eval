/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
module.exports.eval = function (exp) {
  if (exp.value === 0) {
    return '_I.ZERO';
  }
  if (exp.value === 1) {
    return '_I.ONE';
  }
  return 'utils.castInterval(' + exp.value + ')';
};

module.exports.test = function (exp) {
  return exp.type === 'Literal';
};
