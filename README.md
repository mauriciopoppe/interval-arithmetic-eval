# interval-arithmetic-eval 

[![NPM][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url] 
[![Coverage Status][coveralls-image]][coveralls-url]
[![Stability](https://img.shields.io/badge/stability-unstable-yellow.svg)]()

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> Interprets/evaluates mathematical expressions using interval arithmetic

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Description](#description)
- [Installation](#installation)
- [API](#api)
  - [`code = compile(expression)`](#code--compileexpression)
    - [`code.eval([scope])`](#codeevalscope)
  - [`compile.policies`](#compilepolicies)
    - [`compile.policies.identifierAllowed`](#compilepoliciesidentifierallowed)
    - [`compile.policies.disableRounding`](#compilepoliciesdisablerounding)
    - [`compile.policies.enableRounding`](#compilepoliciesenablerounding)
- [Examples](#examples)
  - [Basic operations](#basic-operations)
  - [Function calls](#function-calls)
  - [Scope substitution](#scope-substitution)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

This module evaluates the generated code from [math-codegen](https://github.com/maurizzzio/math-codegen)
for the namespace [interval-arithmetic](https://github.com/maurizzzio/interval-arithmetic) providing
the necessary adapter methods

## Installation

```sh
$ npm install --save interval-arithmetic-eval
```

## API

```javascript
var compile = require('interval-arithmetic-eval');
```

### `code = compile(expression)`

**params**
* `expression` {string} the expression to be parsed

`expression` syntax:
- literals
  - numbers are turned into [singleton intervals](https://github.com/maurizzzio/interval-arithmetic#instancesingletonv)
- identifiers
  - All the methods/utilities/constants available in [interval-arithmetic](https://github.com/maurizzzio/interval-arithmetic)
  - The properties declared in a scope object (top level only) 
- binary expressions
  - `+` addition
  - `-` subtraction
  - `*` multiplication
  - `/` division
  - `^` power (with the condition that the exponent is a signed integer)
- unary expressions
  - `+` identity
  - `-` negative
- array expressions
  - numbers are turned into [intervals](https://github.com/maurizzzio/interval-arithmetic#instanceassignlo-hi)
- call expressions
  - All the methods/utilities/constants available in [interval-arithmetic](https://github.com/maurizzzio/interval-arithmetic)
  except `pow` (which is a special operator)
  - The functions declared in a scope object (top level only) 

**returns** {Object}
* `return.eval` {function} The compiled function to be called with some scope variables

#### `code.eval([scope])`

**params**
* `scope` {Object} 

An optional object which holds some variables used in the original expression
to be substituted, the following transformations are done with the values when evaluated  
  * a single `number` is converted to a [singleton interval](https://github.com/maurizzzio/interval-arithmetic#instancesingletonv)
  * an `array` is converted to an unbounded [interval](https://github.com/maurizzzio/interval-arithmetic#instanceassignlo-hi),
   NOTE: this method checks empty intervals
  * an `object` which has the `lo` and `hi` properties is converted into an [interval](https://github.com/maurizzzio/interval-arithmetic#instanceassignlo-hi)
   NOTE: this method checks empty intervals  

**returns** {Interval} Returns an instance of the [interval-arithmetic module](https://github.com/maurizzzio/interval-arithmetic)

### `compile.policies`

Policies used during the evaluation of an expression

#### `compile.policies.identifierAllowed`

Assign a function which determines if the given name to be resolved from the scope is valid

**default value**
```javascript
compile.policies.identifierAllowed = function (name) {
  // any name from the scope is valid
  return true;
}
```

#### `compile.policies.disableRounding`

Call this function to disable rounding interval bounds to the next/previous floating point number
(rounding is enabled by default)

#### `compile.policies.enableRounding`

Call this function to enable rounding interval bounds to the next/previous floating point number
(rounding is enabled by default)

## Examples

Boilerplate code for the examples:

```javascript
compile(expression).eval(scope)

// e.g.
compile('1').eval({});        // { lo: 1, hi: 1 }
compile('x').eval({x: 1})     // { lo: 1, hi: 1 }
```

### Basic operations
```javascript
1
>  { lo: 1, hi: 1 }

// unary minus
-1
>  { lo: -1, hi: -1 }

// floating point error is carried over in the operations
-1 + 3
>  { lo: 1.9999999999999998, hi: 2.0000000000000004 }

// [1, 1] / [3, 3]
1 / 3
>  { lo: 0.33333333333333326, hi: 0.33333333333333337 }

-1 / 3
>  { lo: -0.33333333333333337, hi: -0.33333333333333326 }

-(1 / 3)
>  { lo: -0.33333333333333337, hi: -0.33333333333333326 }

-1 / -3
>  { lo: 0.33333333333333326, hi: 0.33333333333333337 }

2 * 3
>  { lo: 5.999999999999999, hi: 6.000000000000001 }

[1, 2]
>  { lo: 1, hi: 2 }

-[1, 2]
>  { lo: -2, hi: -1 }

[1, 2] + [-1, 2]
>  { lo: -5e-324, hi: 4.000000000000001 }

// means [1, 2] + [-2, 1]
[1, 2] - [-1, 2]
>  { lo: -1.0000000000000002, hi: 3.0000000000000004 }

[1, 2] * [-1, 2]
>  { lo: -2.0000000000000004, hi: 4.000000000000001 }

[1, 2] / [2, 3]
>  { lo: 0.33333333333333326, hi: 1.0000000000000002 }

// if the upper interval has zero the result will also contain a zero
[-1, 1] / [2, 3]
>  { lo: -0.5000000000000001, hi: 0.5000000000000001 }

// division by an interval that has zero results in a whole interval
[1, 2] / [-1, 1]
>  { lo: -Infinity, hi: Infinity }

// integer power
[-3, 2]^2
>  { lo: 0, hi: 9.000000000000004 }

// integer negative power, 1 / [-3, 2]^2 = 1 / [0, 9]
[-3, 2]^-2
>  { lo: 0.11111111111111105, hi: Infinity }

// integer power (odd power)
[-3, 2]^3
>  { lo: -26.99999999999999, hi: 8.000000000000004 }

```
### Function calls
```javascript
// constants available in interval-arithmetic
ZERO + ONE
>  { lo: 0.9999999999999999, hi: 1.0000000000000002 }

// constant available in interval-arithmetic
PI
>  { lo: 3.141592653589793, hi: 3.1415926535897936 }

// same as -1
negative(1)
>  { lo: -1, hi: -1 }

// same as -1 + 3
add(-1, 3)
>  { lo: 1.9999999999999998, hi: 2.0000000000000004 }

// same as [1, 2] + [-1, 2]
add([1, 2], [-1, 2])
>  { lo: -5e-324, hi: 4.000000000000001 }

// cosine of the interval [0, 0]
cos(0)
>  { lo: 0.9999999999999999, hi: 1.0000000000000002 }

// cosine of the interval [PI_low, PI_high]
cos(PI)
>  { lo: -1, hi: -0.9999999999999999 }

// cosine of the interval [PI_low / 2, PI_high / 2] which contains zero
cos(PI_HALF)
>  { lo: -3.82856869892695e-16, hi: 2.8327694488239903e-16 }

// all the available values for cosine
cos([0, 3.15])
>  { lo: -1, hi: 1.0000000000000002 }

sin(PI_HALF)
>  { lo: 0.9999999999999999, hi: 1 }

// absolute value of the interval [-1, 1]
abs(-1)
>  { lo: 1, hi: 1 }

// absolute value of the interval [-3, -2]
abs([-3, -2])
>  { lo: 2, hi: 3 }

// absolute value of the interval [-2, 3]
abs([-2, 3])
>  { lo: 0, hi: 3 }

// 1 / 2
multiplicativeInverse(2)
>  { lo: 0.49999999999999994, hi: 0.5000000000000001 }

```
### Scope substitution
```javascript
// using the number 4 stored in scope.x
// scope:  { x: 4 }
x
>  { lo: 4, hi: 4 }

// using the interval [2, 3] stored in scope.x
// scope:  { x: [ 2, 3 ] }
x
>  { lo: 2, hi: 3 }

// using the interval Instance stored in scope.x
// scope:  { x: { lo: 2, hi: 3 } }
x
>  { lo: 2, hi: 3 }

// adding a constant and a scope variable
// scope:  { x: [ 1, 1 ] }
ONE + x
>  { lo: 1.9999999999999998, hi: 2.0000000000000004 }

// division between two variables stored in the scope
// scope:  { x: [ 2, 3 ], y: [ 1, 2 ] }
x / y
>  { lo: 0.9999999999999999, hi: 3.0000000000000004 }

// complex expression
// scope:  { x: [ 0, 1 ] }
sin(exp(x)) + tan(x) - 1/cos(PI) * ([1, 3]^2)
>  { lo: 1.410781290502905, hi: 11.557407724654913 }

```

2015 © Mauricio Poppe

[npm-image]: https://img.shields.io/npm/v/interval-arithmetic-eval.svg?style=flat
[npm-url]: https://npmjs.org/package/interval-arithmetic-eval
[travis-image]: https://travis-ci.org/maurizzzio/interval-arithmetic-eval.svg?branch=master
[travis-url]: https://travis-ci.org/maurizzzio/interval-arithmetic-eval
[coveralls-image]: https://coveralls.io/repos/maurizzzio/interval-arithmetic-eval/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/maurizzzio/interval-arithmetic-eval?branch=master
[david-image]: https://david-dm.org/maurizzzio/interval-arithmetic-eval.svg
[david-url]: https://david-dm.org/maurizzzio/interval-arithmetic-eval
