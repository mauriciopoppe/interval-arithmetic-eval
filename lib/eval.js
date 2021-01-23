/**
 * Created by mauricio on 5/12/15.
 */
'use strict'

const CodeGenerator = require('math-codegen')
const Interval = require('interval-arithmetic').default
require('./adapter')(Interval)

function processScope (scope) {
  Object.keys(scope).forEach(function (k) {
    const value = scope[k]
    if (typeof value === 'number' || Array.isArray(value)) {
      scope[k] = Interval.factory(value)
    } else if (typeof value === 'object' && 'lo' in value && 'hi' in value) {
      scope[k] = Interval.factory(value.lo, value.hi)
    }
  })
}

module.exports = function (expression) {
  return new CodeGenerator()
    .setDefs({
      $$processScope: processScope
    })
    .parse(expression)
    .compile(Interval)
}

module.exports.policies = require('./policies')(Interval)
module.exports.Interval = Interval
