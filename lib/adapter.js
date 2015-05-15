'use strict';
module.exports = function (ns) {
  // unary
  ns.unaryMinus = ns.negative;
  ns.unaryPlus = ns.positive;

  // arithmetic
  ns.subtract = ns.sub;
  ns.multiply = ns.mul;
  ns.divide = ns.div;
};
