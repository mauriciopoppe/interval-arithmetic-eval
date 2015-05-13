# interval-arithmetic-eval [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

[![NPM][npm-image]][npm-url]

> Interprets/evaluates mathematical expressions using interval arithmetic

## Description

This module interprets the ast generated by the tiny yet extremely helpful [jsep](http://jsep.from.so/)
generated for *mathematical expressions* and compiles a function that is evaluated with intervals instead
of simple numbers

## Installation

```sh
$ npm install --save interval-arithmetic-eval
```

## API

```javascript
var compile = require('interval-arithmetic-eval');
```

### `compile(expression)`

**params**
* `expression` {string} the string to be compiled

## Inspiration projects

- [math.js expression parser](http://mathjs.org/docs/expressions/index.html)

2015 © Mauricio Poppe

[npm-image]: https://nodei.co/npm/interval-arithmetic-eval.png?downloads=true
[npm-url]: https://npmjs.org/package/interval-arithmetic-eval
[travis-image]: https://travis-ci.org/maurizzzio/interval-arithmetic-eval.svg?branch=master
[travis-url]: https://travis-ci.org/maurizzzio/interval-arithmetic-eval
[coveralls-image]: https://coveralls.io/repos/maurizzzio/interval-arithmetic-eval/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/maurizzzio/interval-arithmetic-eval?branch=master