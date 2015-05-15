/**
 * Created by mauricio on 5/14/15.
 */
'use strict';
module.exports = function (next, exp) {
  return '("' + exp.name + '" in scope ? ' +
    'scope["' + exp.name + '"] : ' +
    'ns["' + exp.name + '"])';
};
