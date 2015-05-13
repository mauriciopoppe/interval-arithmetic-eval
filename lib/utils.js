/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
var utils = {
  error: {},
  eval: {}
};

utils.error.notDefined = function (exp) {
  throw Error('the ' + exp.operator + ' operator is not defined in interval-arithmetic');
};
utils.error.cannotCast = function (exp) {
  throw Error('expression ' + exp + ' cannot be casted into an interval');
};
utils.error.notAllowed = function (name) {
  throw Error('expression ' + name + ' is not allowed');
};

utils.eval.castInterval = function (_I, v) {
  if (typeof v === 'number') {
    return new _I().boundedSingleton(v);
  }
  if (Array.isArray(v)) {
    return new _I().bounded(v[0], v[1]);
  }
};

utils.eval.castIdentifier = function (interval, v) {
  return this.castInterval(interval, v) || v;
};

module.exports = utils;
