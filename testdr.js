

var fix = require('./lib/fixphpexpr.js');

// var str = "-test_func('#{data.val}')#{data.val2}";
var str = "<?php test_func('#{data.val}'); ?>";

console.log(fix(str));
