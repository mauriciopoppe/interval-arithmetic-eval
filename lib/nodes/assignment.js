/**
 * Created by mauricio on 5/14/15.
 */
'use strict';

module.exports = function (next, exp) {
  return 'scope["' + exp.name + '"] = ' + next(exp.expr);
};
