/**
 * Created by mauricio on 5/14/15.
 */
'use strict';

var types = {
  ArrayNode: require('./nodes/array'),
  AssignmentNode: require('./nodes/assignment'),
  BlockNode: require('./nodes/block'),
  ConditionalNode: require('./nodes/conditional'),
  ConstantNode: require('./nodes/constant'),
  FunctionNode: require('./nodes/function'),
  OperatorNode: require('./nodes/operator'),
  SymbolNode: require('./nodes/symbol')
};

var generate = module.exports = function (node) {
  if (!(node.type in types)) {
    throw new TypeError('the node type ' + node.type + ' is not implemented');
  }
  return types[node.type](generate, node);
};
