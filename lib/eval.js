/**
 * Created by mauricio on 5/12/15.
 */
'use strict';

var math = require('mathjs');
var interpreter = require('./interpreter');
var Interval = require('interval-arithmetic');
require('./adapter')(Interval);

function processScope(scope) {
  Object.keys(scope).forEach(function (k) {
    var value = scope[k];
    if (typeof value === 'number') {
      scope[k] = Interval.factory(value);
    } else if (Array.isArray(value)) {
      scope[k] = Interval.factory(value[0], value[1]);
    } else if (typeof value === 'object' && 'lo' in value && 'hi' in value) {
      scope[k] = Interval.factory(value.lo, value.hi);
    }
  });
}

function compile(code) {
  var defs = {
    ns: Interval,
    _processScope: processScope
  };

  var defsCode = Object.keys(defs).map(function (name) {
    return 'var ' + name + ' = defs["' + name + '"];';
  });

  var factoryCode =
    defsCode.join(' ') +
    'return {' +
    '  eval: function (scope) {' +
    '    scope = scope || {};' +
    '    _processScope(scope);' +
    '    return ' + code + ';' +
    '  },' +
    '  code: \'' + code + '\'' +
    '};';

  /* eslint-disable */
  //console.log(factoryCode);
  var factory = new Function('defs', factoryCode);
  /* eslint-enable */
  return factory(defs);
}

module.exports = function (exp) {
  var node = math.parse(exp);
  var body = interpreter(node);
  return compile(body);
};

module.exports.policies = require('./policies');
module.exports.Interval = Interval;
