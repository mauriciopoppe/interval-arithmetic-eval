/**
 * Created by mauricio on 5/13/15.
 */
'use strict';
var math = require('mathjs');

var exp = math.parse('ceil(1)');
console.log(exp.compile(math).eval.toString());
console.log(JSON.stringify(exp, null, 2));

