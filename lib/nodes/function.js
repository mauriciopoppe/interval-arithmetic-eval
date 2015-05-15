/**
 * Created by mauricio on 5/14/15.
 */
'use strict';
module.exports = function (next, exp) {
  var name = exp.name;
  var args = [];
  for (var i = 0; i < exp.args.length; i += 1) {
    args.push(next(exp.args[i]));
  }
  var joined = args.join(', ');
  return '("' + name + '" in scope ? ' +
      'scope["' + name + '"] : ' +
      'ns["' + name + '"])(' + joined + ')';
};
