/**
 * Created by mauricio on 5/14/15.
 */
'use strict';

module.exports = function (next, exp) {
  var blocks = exp.blocks;
  var statements = [];
  for (var i = 0; i < blocks.length; i += 1) {
    statements.push(next(exp.blocks[i].node));
  }
  return '(' + statements.join(',') + ')';
};
