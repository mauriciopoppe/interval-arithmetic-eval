'use strict';

var assert = require('assert');
var Interval = require('interval-arithmetic');
var compile = require('../');
var exp;

function cleanAssert(a, b) {
  assert(a && a.code);
  a = a.code.replace(/\s/g, '');
  b = b.replace(/\s/g, '');
  assert(a === b);
}

function almostEqual(a, b) {
  return Interval.almostEqual(a, b);
}

describe('interval arithmetic evaluator', function () {
  describe('with literals', function () {
    it('should cast constants', function () {
      exp = compile('0');
      cleanAssert(exp, 'ns.factory(0)');
      almostEqual(exp.eval(), [0, 0]);

      exp = compile('1');
      cleanAssert(exp, 'ns.factory(1)');
      almostEqual(exp.eval(), [1, 1]);

      assert.throws(function () {
        compile('"1"');
      });
    });

    it('should cast arrays as interval', function () {
      exp = compile('[-2, 3]');
      cleanAssert(exp, 'ns.factory(ns.unaryMinus(ns.factory(2)), ns.factory(3))');
      almostEqual(exp.eval(), [-2, 3]);
    });
  });

  describe('with identifiers', function () {
    it('should cast interval arithmetic built-in functions', function () {
      exp = compile('add(1, 2)');
      almostEqual(exp.eval(), [3, 3]);

      exp = compile('PI');
      almostEqual(exp.eval(), Interval.PI);

      exp = compile('ZERO');
      almostEqual(exp.eval(), Interval.ZERO);

      exp = compile('ONE');
      almostEqual(exp.eval(), Interval.ONE);

      assert.throws(function () {
        console.log(compile('1 or 2'));
      });
    });

    it('should compile scope stored variables', function () {
      exp = compile('x');

      var scope;
      scope = {x: 1};
      almostEqual(exp.eval(scope), Interval.ONE);
      almostEqual(scope.x, Interval.ONE);

      scope = {x: [-1, 2]};
      almostEqual(exp.eval(scope), [-1, 2]);
      almostEqual(scope.x, [-1, 2]);

      scope = {x: Interval.factory(-1, 2)};
      almostEqual(exp.eval(scope), [-1, 2]);
      almostEqual(scope.x, [-1, 2]);

      // duck typing
      scope = {x: {lo: -1, hi: 2}};
      almostEqual(exp.eval(scope), [-1, 2]);
    });

    it('should throw on undefined functions', function () {
      assert.throws(function () {
        exp = compile('nope(3)');
        exp.eval();
      });
    });
  });

  describe('with unary operators', function () {
    it('should negate an interval', function () {
      // negative
      exp = compile('-1');
      cleanAssert(exp, 'ns.unaryMinus(ns.factory(1))');
      almostEqual(exp.eval(), [-1, -1]);
    });

    it('should apply it multiple times', function () {
      exp = compile('-+-1');
      cleanAssert(exp, 'ns.unaryMinus(ns.unaryPlus(ns.unaryMinus(ns.factory(1))))');
      almostEqual(exp.eval(), [1, 1]);
    });

    it('should apply it on arrays', function () {
      exp = compile('-[1, 3]');
      cleanAssert(exp, 'ns.unaryMinus(ns.factory(ns.factory(1), ns.factory(3)))');
      almostEqual(exp.eval(), [-3, -1]);
    });

    it('should throw on non existent', function () {
      assert.throws(function () {
        compile('!3');
      });
    });
  });

  describe('with binary operators', function () {
    it('should compute interval addition/subtraction', function () {
      exp = compile('1 + 2');
      cleanAssert(exp, 'ns.add(ns.factory(1), ns.factory(2))');
      almostEqual(exp.eval(), [3, 3]);

      exp = compile('1 + [2, 3]');
      cleanAssert(exp, 'ns.add(ns.factory(1), ns.factory(ns.factory(2), ns.factory(3)))');
      almostEqual(exp.eval(), [3, 4]);

      exp = compile('[-1, 1] + [1, 1]');
      almostEqual(exp.eval(), [0, 2]);

      exp = compile('[-1, 1] + [1, -1]');
      assert(Interval.empty(exp.eval()));

      exp = compile('1 - 2');
      almostEqual(exp.eval(), [-1, -1]);

      exp = compile('1 - [2, 3]');
      almostEqual(exp.eval(), [-2, -1]);

      exp = compile('[-1, 1] - [1, +1]');
      almostEqual(exp.eval(), [-2, 0]);

      exp = compile('[-1, 1] - [1, -1]');
      assert(Interval.empty(exp.eval()));
    });

    it('should compute interval powers (with integer powers only)', function () {
      exp = compile('1^2');
      cleanAssert(exp, 'ns.pow(ns.factory(1), ns.factory(2))');
      almostEqual(exp.eval(), [1, 1]);

      exp = compile('3^2');
      almostEqual(exp.eval(), [9, 9]);

      exp = compile('[2, 3]^[2, 2]');
      cleanAssert(exp, 'ns.pow(ns.factory(ns.factory(2), ns.factory(3)), ns.factory(ns.factory(2), ns.factory(2)))');
      almostEqual(exp.eval(), [4, 9]);

      exp = compile('[2, 3]^[2, 3]');
      cleanAssert(exp, 'ns.pow(ns.factory(ns.factory(2), ns.factory(3)), ns.factory(ns.factory(2), ns.factory(3)))');
      assert(Interval.empty(exp.eval()));

      exp = compile('x^2');
      almostEqual(exp.eval({ x: 2 }), [4, 4]);
      almostEqual(exp.eval({ x: [2, 3] }), [4, 9]);
      almostEqual(exp.eval({ x: [-3, 2] }), [0, 9]);
    });
  });

  describe('with non-existent expression types', function () {
    it('should throw', function () {
      assert.throws(function () {
        compile('f(x) = 3');
      });
    });
  });

  describe('with various operations', function () {
    it('should compute random operations', function () {
      exp = compile('cos([0, 3.15])');
      almostEqual(exp.eval(), [-1, 1]);

      exp = compile('sin(PI_HALF)');
      almostEqual(exp.eval(), [1, 1]);

      exp = compile('abs(-1)');
      almostEqual(exp.eval(), [1, 1]);

      exp = compile('abs([-3, -2])');
      almostEqual(exp.eval(), [2, 3]);

      exp = compile('abs([-2, 3])');
      almostEqual(exp.eval(), [0, 3]);

      exp = compile('multiplicativeInverse(2)');
      almostEqual(exp.eval(), [0.5, 0.5]);
    });

    it('should compute the square root of a number', function () {
      exp = compile('sqrt(4)');
      almostEqual(exp.eval(), [2, 2]);

      exp = compile('sqrt([4, 9])');
      almostEqual(exp.eval(), [2, 3]);

      exp = compile('sqrt(x)');
      almostEqual(exp.eval({ x: 4 }), [2, 2]);
      almostEqual(exp.eval({ x: [4, 9] }), [2, 3]);
    });

    it('should compile complex expressions', function () {
      exp = compile('sqrt(2)^2');
      almostEqual(exp.eval(), [2, 2]);

      exp = compile('sqrt([2, 3])^2');
      almostEqual(exp.eval(), [2, 3]);

      exp = compile('sqrt(x)^2');
      almostEqual(exp.eval({ x: 2 }), [2, 2]);
      almostEqual(exp.eval({ x: [2, 3] }), [2, 3]);
      almostEqual(exp.eval({ x: [-3, 2] }), [0, 2]);

      exp = compile('1 / x');
      almostEqual(exp.eval({ x: 1 }), [1, 1]);
      assert(Interval.whole(exp.eval({ x: [-1, 1] })));

      exp = compile('x / y');
      almostEqual(exp.eval({ x: [2, 3], y: [1, 2] }), [1, 3]);

      exp = compile('sin(exp(x))');
      almostEqual(exp.eval({ x: [0, 1] }), [0.41078129050290557, 1]);

      exp = compile('sin(exp(x)) + tan(x) - 1/cos(PI) * [1, 3]^2');
      almostEqual(exp.eval({ x: [0, 1] }), [1.4107812905029047, 11.557407724654915]);
    });
  });

  describe('assignment', function () {
    it('should update a property of the scope', function () {
      var scope = {x: 1};
      compile('y = x').eval(scope);
      almostEqual(scope.x, scope.y);
    });
  });

  describe('block', function () {
    it('should update a property of the scope', function () {
      var scope = {x: 1};
      var exp = compile('y = 1 + x; y + 1');
      var res = exp.eval(scope);
      almostEqual(res, [3, 3]);
      almostEqual(scope.x, [1, 1]);
      almostEqual(scope.y, [2, 2]);
    });
  });

  describe('conditional', function () {
    it('should work with the ternary operator', function () {
      var res, exp, scope;
      scope = {x: 1};
      exp = compile('x ? [1, 2] : [3, 4]');
      res = exp.eval(scope);
      almostEqual(res, [1, 2]);

      // TODO: add comparison operators
      assert.throws(function () {
        scope = {x: 1};
        exp = compile('x != 1 ? [1, 2] : [3, 4]');
        res = exp.eval(scope);
        almostEqual(res, [3, 4]);
      });
    });
  });

  describe('policies', function () {
    before(function () {
      compile.policies.disableRounding();
    });

    after(function () {
      compile.policies.enableRounding();
    });

    it('should disable round modes', function () {
      exp = compile('1 / 3').eval();
      assert(1 / 3 === exp.lo && exp.lo === exp.hi);
    });
  });
});
