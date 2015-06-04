'use strict';

// var jade4php = require('../lib/phpjade.js');
// var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['awesome'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  for_debug: function(test) {
    test.expect(1);
    // tests here
    var fn;
    var php;
    var jade = require('jade');
    var phpjade;
    phpjade  = require('../lib/phpjade.js');
    phpjade.init(jade);

    fn = jade.compileFile('test/fixtures/test7.jade', {usestrip: true, pretty: true});
    php = fn({data: {val: "efghi" } });
console.log(php);
//
//    if (phpjade) { phpjade.restore(); }
//
//    fn = jade.compileFile('test/fixtures/test6.jade', {usestrip: true, pretty: true});
//    php = fn({data: {val: "efghi" } });
//console.log(php);
    test.ok(php);
    test.done();
  },
//  php_options: function(test) {
//    test.expect(1);
//    // tests here
//    var jade = require('jade');
//    jade4php.init(jade);
//
//    var fn = jade.compileFile('test/fixtures/phptest1.jade', {usestrip: true});
//    var php = fn({});
//    var expected = grunt.file.read('test/expected/phptest1.php');
//    test.equal(php, expected);
//    test.done();
//
//    jade4php.restore();
//
//  },
//  html_options: function(test) {
//    test.expect(1);
//    var jade = require('jade');
//    var fn = jade.compileFile('test/fixtures/htmltest1.jade', {});
//    var html = fn({});
//    var expected = grunt.file.read('test/expected/htmltest1.html');
//
//    test.equal(html, expected);
//
//    test.done();
//  },
//  php_options2: function(test) {
//    test.expect(1);
//    // tests here
//    var jade = require('jade');
//    jade4php.init(jade);
//
//    var fn = jade.compileFile('test/fixtures/phptest2.jade', 
//      {
//        usestrip: true,
//        pretty: true,
//        prefunction: function(input/*, options*/) {
//          return input.replace(/\$\$+/, "#{data.domain}"); 
//        },
//      });
//    var php = fn({data: { domain: "mytextdomain" } });
//    var expected = grunt.file.read('test/expected/phptest2.php');
//    test.equal(php, expected);
//    test.done();
//
//    jade4php.restore();
//
//  },
//  php_options3: function(test) {
//    test.expect(1);
//    // tests here
//    var jade = require('jade');
//    jade4php.init(jade);
//
//    var fn = jade.compileFile('test/fixtures/phptest3.jade', 
//      {
//        pretty: true,
//        prefunction: function(input/*, options*/) {
//          return input.replace(/\$\$+/, "#{data.domain}"); 
//        },
//      });
//    var php = fn({data: { domain: "mytextdomain" } });
//    var expected = grunt.file.read('test/expected/phptest3.php');
//    test.equal(php, expected);
//    test.done();
//
//    jade4php.restore();
//
//  },
//
};
