/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
var utils = require('../utils');

module.exports.eval = function (next, exp) {
  if (exp.operator === '-') {
    return -module.exports.eval(next, exp.argument);
  }
  if (exp.operator === '+') {
    return module.exports.eval(next, exp.argument);
  }
  if (typeof exp.value === 'number') {
    return exp.value;
  }
  utils.error.notAllowed(exp.operator || exp.value);
};
