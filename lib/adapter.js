'use strict';
module.exports = function (ns) {
  // unary
  ns.unaryMinus = ns.negative;
  ns.unaryPlus = ns.positive;

  // arithmetic
  ns.subtract = ns.sub;
  ns.multiply = ns.mul;
  ns.divide = ns.div;

  // relational
  ns.smaller = ns.lt;
  ns.smallerEq = ns.leq;
  ns.larger = ns.gt;
  ns.largerEq = ns.geq;
  ns.unequal = ns.notEqual;
};
