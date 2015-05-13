'use strict';

var assert = require('assert');
var I = require('interval-arithmetic');
var compile = require('../');
var utils = require('../lib/utils');
var exp;

function cleanAssert(a, b) {
  assert(a && a.rawBody);
  a = a.rawBody.replace(/\s/g, '');
  b = b.replace(/\s/g, '');
  assert(a === b);
}

describe('interval arithmetic evaluator', function () {
  describe('with literals', function () {
    it('should cast constants', function () {
      exp = compile('0');
      cleanAssert(exp, '_I.ZERO');
      I.almostEqual(exp.eval(), [0, 0]);

      exp = compile('1');
      cleanAssert(exp, '_I.ONE');
      I.almostEqual(exp.eval(), [1, 1]);
    });

    it('should cast numbers', function () {
      exp = compile('42');
      cleanAssert(exp, 'utils.castInterval(_I, 42)');
      I.almostEqual(exp.eval(), [42, 42]);
    });

    it('should cast arrays as interval', function () {
      exp = compile('[2, 3]');
      cleanAssert(exp, 'utils.castInterval(_I, [2, 3])');
      I.almostEqual(exp.eval(), [2, 3]);
    });
  });

  describe('with identifiers', function () {
    it('should cast interval arithmetic built-in functions', function () {
      exp = compile('sin');
      cleanAssert(exp, '_I.sin');

      exp = compile('add');
      cleanAssert(exp, '_I.add');

      exp = compile('PI');
      cleanAssert(exp, '_I.PI');
      I.almostEqual(exp.eval(), I.PI);

      exp = compile('ONE');
      cleanAssert(exp, '_I.ONE');
      I.almostEqual(exp.eval(), I.ONE);
    });

    it('should compile scope stored variables', function () {
      exp = compile('x');
      cleanAssert(exp, 'utils.castIdentifier(_I, scope["x"])');

      exp = compile('_');
      cleanAssert(exp, 'utils.castIdentifier(_I, scope["_"])');
    });

    it('should eval scope stored variables', function () {
      // numbers as a bounded singleton interval
      exp = compile('x');
      I.almostEqual(exp.eval({ x : 3 }), [3, 3]);

      // arrays as a bounded interval
      exp = compile('x');
      I.almostEqual(exp.eval({ x : [2, 3] }), [2, 3]);
    });
  });

  describe('with unary operators', function () {
    it('should negate an interval', function () {
      // negative
      exp = compile('-1');
      cleanAssert(exp, '_I.negative(_I.ONE)');
      I.almostEqual(exp.eval(), [-1, -1]);
    });

    it('should apply it multiple times', function () {
      exp = compile('-+-1');
      cleanAssert(exp, '_I.negative(_I.positive(_I.negative(_I.ONE)))');
      I.almostEqual(exp.eval(), [1, 1]);
    });

    it('should apply it on arrays', function () {
      exp = compile('-[1, 3]');
      cleanAssert(exp, '_I.negative(utils.castInterval(_I, [1 ,3]))');
      I.almostEqual(exp.eval(), [-3, -1]);
    });
  });

  describe('with binary operators', function () {
    it('should compute interval addition', function () {
      exp = compile('1 + 2');
      cleanAssert(exp, '_I.add(_I.ONE, utils.castInterval(_I, 2))');
      I.almostEqual(exp.eval(), [3, 3]);

      exp = compile('1 + [2, 3]');
      cleanAssert(exp, '_I.add(_I.ONE, utils.castInterval(_I, [2, 3]))');
      I.almostEqual(exp.eval(), [3, 4]);

      exp = compile('[-1, 1] + [1, 1]');
      cleanAssert(exp, '_I.add(utils.castInterval(_I, [-1, 1]), utils.castInterval(_I, [1, 1]))');
      I.almostEqual(exp.eval(), [0, 2]);

      exp = compile('[-1, 1] + [1, -1]');
      cleanAssert(exp, '_I.add(utils.castInterval(_I, [-1, 1]), utils.castInterval(_I, [1, -1]))');
      I.empty(exp.eval());
    });

    it('should compute interval subtraction', function () {
      exp = compile('1 - 2');
      cleanAssert(exp, '_I.sub(_I.ONE, utils.castInterval(_I, 2))');
      I.almostEqual(exp.eval(), [-1, -1]);

      exp = compile('1 - [2, 3]');
      cleanAssert(exp, '_I.sub(_I.ONE, utils.castInterval(_I, [2, 3]))');
      I.almostEqual(exp.eval(), [-2, -1]);

      exp = compile('[-1, 1] - [1, 1]');
      cleanAssert(exp, '_I.sub(utils.castInterval(_I, [-1, 1]), utils.castInterval(_I, [1, 1]))');
      I.almostEqual(exp.eval(), [-2, 0]);

      exp = compile('[-1, 1] - [1, -1]');
      cleanAssert(exp, '_I.sub(utils.castInterval(_I, [-1, 1]), utils.castInterval(_I, [1, -1]))');
      I.empty(exp.eval());
    });

    it('should compute interval powers (with integer powers only)', function () {
      exp = compile('1^2');
      cleanAssert(exp, '_I.pow(_I.ONE, 2)');
      I.almostEqual(exp.eval(), [1, 1]);

      exp = compile('3^2');
      cleanAssert(exp, '_I.pow(utils.castInterval(_I, 3), 2)');
      I.almostEqual(exp.eval(), [9, 9]);

      exp = compile('[2, 3]^2');
      cleanAssert(exp, '_I.pow(utils.castInterval(_I, [2, 3]), 2)');
      I.almostEqual(exp.eval(), [4, 9]);

      exp = compile('x^2');
      cleanAssert(exp, '_I.pow(utils.castIdentifier(_I, scope["x"]), 2)');
      I.almostEqual(exp.eval({ x: 2 }), [4, 4]);
      I.almostEqual(exp.eval({ x: [2, 3] }), [4, 9]);
      I.almostEqual(exp.eval({ x: [-3, 2] }), [0, 9]);
    });
  });

  describe('with misc operations', function () {
    it('should compute the square root of a number', function () {
      exp = compile('sqrt(4)');
      cleanAssert(exp, '_I.sqrt(utils.castInterval(_I, 4))');
      I.almostEqual(exp.eval(), [2, 2]);

      exp = compile('sqrt([4, 9])');
      cleanAssert(exp, '_I.sqrt(utils.castInterval(_I, [4, 9]))');
      I.almostEqual(exp.eval(), [2, 3]);

      exp = compile('sqrt(x)');
      cleanAssert(exp, '_I.sqrt(utils.castIdentifier(_I, scope["x"]))');
      I.almostEqual(exp.eval({ x: 4 }), [2, 2]);
      I.almostEqual(exp.eval({ x: [4, 9] }), [2, 3]);
    });

    it('should compile complex expressions', function () {
      exp = compile('sqrt(2)^2');
      cleanAssert(exp, '_I.pow(_I.sqrt(utils.castInterval(_I, 2)), 2)');
      I.almostEqual(exp.eval(), [2, 2]);

      exp = compile('sqrt([2, 3])^2');
      cleanAssert(exp, '_I.pow(_I.sqrt(utils.castInterval(_I, [2, 3])), 2)');
      I.almostEqual(exp.eval(), [2, 3]);

      exp = compile('sqrt(x)^2');
      cleanAssert(exp, '_I.pow(_I.sqrt(utils.castIdentifier(_I, scope["x"])), 2)');
      I.almostEqual(exp.eval({ x: 2 }), [2, 2]);
      I.almostEqual(exp.eval({ x: [2, 3] }), [2, 3]);
      I.almostEqual(exp.eval({ x: [-3, 2] }), [0, 2]);

      exp = compile('1/x');
      cleanAssert(exp, '_I.div(_I.ONE, utils.castIdentifier(_I, scope["x"]))');
      I.almostEqual(exp.eval({ x: 1 }), [1, 1]);
      I.empty(exp.eval({ x: 0 }));
      I.empty(exp.eval({ x: [-1, 1] }));
    });
  });
});
