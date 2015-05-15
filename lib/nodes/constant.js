/**
 * Created by mauricio on 5/14/15.
 */
'use strict';
var utils = require('../utils');

module.exports = function (next, exp) {
  switch (exp.valueType) {
    case 'number':
      return 'ns.factory(' + exp.value + ')';
    default:
      utils.notAllowed(exp.value);
      break;
  }
};
