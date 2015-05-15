/**
 * Created by mauricio on 5/14/15.
 */
'use strict';

module.exports = function (next, exp) {
  switch (exp.valueType) {
    case 'number':
      return 'ns.factory(' + exp.value + ')';
    default:
      throw new TypeError(exp.value + ' is not allowed, only numbers are allowed to be constants');
  }
};
