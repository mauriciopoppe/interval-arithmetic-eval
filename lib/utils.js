/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
var utils = {
  error: {},
  eval: {}
};

utils.error.notDefined = function (exp) {
  throw Error(exp + ' is not defined');
};
utils.error.notAllowed = function (name) {
  throw Error('expression ' + name + ' is not allowed');
};

utils.eval.castInterval = function (_I, v) {
  if (typeof v === 'number') {
    if (v === 0) {
      return _I.ZERO;
    }
    if (v === 1) {
      return _I.ONE;
    }
    return new _I().singleton(v);
  }
  if (Array.isArray(v)) {
    return new _I().assign(v[0], v[1]);
  }
  // duck typing for an Interval instance
  if (typeof v === 'object' && typeof v.lo === 'number' && typeof v.hi === 'number') {
    return new _I().assign(v.lo, v.hi);
  }
};

utils.eval.castIdentifier = function (interval, v) {
  return this.castInterval(interval, v) || v;
};

module.exports = utils;
