'use strict';
module.exports = function (ns) {
  // mod
  ns.mod = ns.fmod;

  // relational
  ns.lessThan = ns.lt;
  ns.lessEqualThan = ns.leq;
  ns.greaterThan = ns.gt;
  ns.greaterEqualThan = ns.geq;
};
