/**
 * Created by mauricio on 5/12/15.
 */
'use strict'
module.exports = function (Interval) {
  return {
    disableRounding: function () {
      Interval.round.disable()
    },

    enableRounding: function () {
      Interval.round.enable()
    }
  }
}
