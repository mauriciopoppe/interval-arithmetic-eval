'use strict'
module.exports = function (ns) {
  // mod
  ns.mod = ns.fmod

  // relational
  ns.lessThan = ns.lt
  ns.lessEqualThan = ns.leq
  ns.greaterThan = ns.gt
  ns.greaterEqualThan = ns.geq

  ns.strictlyEqual = ns.equal
  ns.strictlyNotEqual = ns.notEqual

  ns.logicalAND = function (a, b) {
    return a && b
  }
  ns.logicalXOR = function (a, b) {
    return a ^ b
  }
  ns.logicalOR = function (a, b) {
    return a || b
  }
}
