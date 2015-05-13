/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
var Interval = require('interval-arithmetic');
var policies = require('../policies');
var utils = require('../utils');
module.exports.eval = function (next, exp) {
  if (Interval[exp.name]) {
    return '_I.' + exp.name;
  }
  if (!policies.identifierAllowed(exp.name)) {
    utils.error.notAllowed(exp.name);
  }
  // defaults to scope if not found on interval-arithmetic
  return 'utils.castIdentifier(_I, scope["' + exp.name + '"])';
};

module.exports.test = function (exp) {
  return exp.type === 'Identifier';
};
