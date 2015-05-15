/**
 * Created by mauricio on 5/13/15.
 */
'use strict';
var math = require('mathjs');
//var Interval = require('interval-arithmetic');

var exp = math.parse('1 / 3');
console.log(exp.compile(math).eval.toString());
console.log(JSON.stringify(exp, null, 2));

