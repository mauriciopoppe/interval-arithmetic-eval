/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
module.exports.eval = function (next, exp) {
  return 'utils.castInterval(_I, ' + exp.value + ')';
};

module.exports.test = function (exp) {
  return exp.type === 'Literal';
};
