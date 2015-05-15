/**
 * Created by mauricio on 5/14/15.
 */
'use strict';

module.exports = function (next, exp) {
  var arr = exp.nodes.map(function (node) {
    return next(node);
  });
  return 'ns.factory(' + arr.join(', ') + ')';
};
