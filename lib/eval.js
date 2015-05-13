/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
var parse = require('jsep');
var Interval = require('interval-arithmetic');
var utils = require('./utils');

var ops = [
  require('./expressions/binary'),
  require('./expressions/call'),
  require('./expressions/unary'),
  require('./operands/identifier'),
  require('./operands/literal')
];

// TODO: implicit equations parsing
function interpreter(exp) {
  var res;
  for (var i = 0; !res && i < ops.length; i += 1) {
    if (ops[i].test(exp)) {
      res = ops[i].eval(exp, interpreter);
    }
  }
  return res;
}

var run = module.exports = function (exp) {
  var ast = parse(exp);
  var body = 'return ' + interpreter(ast);
  var fn = new Function('_I', 'utils', 'scope', body);
  return {
    eval: function (scope) {
      scope = scope || {};
      return fn(Interval, utils.eval, scope);
    },
    body: function () {
      return body;
    }
  };
};

var res = run('1 / x');
console.log(res.body());
console.log(res.eval({x: 3}));
