/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
var parse = require('jsep');
var Interval = require('interval-arithmetic');
var utils = require('./utils');

var ops = [
  require('./expressions/array'),
  require('./expressions/binary'),
  require('./expressions/call'),
  require('./expressions/unary'),
  require('./expressions/pow'),
  require('./operands/identifier'),
  require('./operands/literal')
];

// TODO: implicit equations parsing
function interpreter(exp) {
  var res;
  for (var i = 0; !res && i < ops.length; i += 1) {
    if (ops[i].test(exp)) {
      res = ops[i].eval(interpreter, exp);
    }
  }
  return res;
}

module.exports = function (exp) {
  var ast = parse(exp);
  var rawBody = interpreter(ast);
  var body = 'return ' + rawBody;
  /* eslint-disable */
  var fn = new Function('_I', 'utils', 'scope', body);
  /* eslint-enable */
  return {
    eval: function (scope) {
      scope = scope || {};
      return fn(Interval, utils.eval, scope);
    },
    body: body,
    rawBody: rawBody,
    rawFn: fn.toString()
  };
};

module.exports.policies = require('./policies');
module.exports.Interval = Interval;
