/**
 * Created by mauricio on 5/12/15.
 */
'use strict';
var Interval = require('interval-arithmetic');
module.exports = {
  identifierAllowed: function () {
    return true;
  },

  disableRound: function () {
    Interval.rmath.disable();
  },

  enableRound: function () {
    Interval.rmath.enable();
  }
};
