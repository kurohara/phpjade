'use strict';

var grunt = require('grunt');
var jade4php = require('../lib/phpjade.js');

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
  php_options: function(test) {
    test.expect(1);
    // tests here
    var jade = require('jade');
    jade4php.init(jade);

    var fn = jade.compileFile('test/fixtures/phptest1.jade', {usestrip: true});
    var php = fn({});
    var expected = grunt.file.read('test/expected/phptest1.php');
    test.equal(php, expected);
    test.done();

    jade4php.restore();

  },
  html_options: function(test) {
    test.expect(1);
    var jade = require('jade');
    var fn = jade.compileFile('test/fixtures/htmltest1.jade', {});
    var html = fn({});
    var expected = grunt.file.read('test/expected/htmltest1.html');

    test.equal(html, expected);

    test.done();
  },
  php_options2: function(test) {
    test.expect(1);
    // tests here
    var jade = require('jade');
    jade4php.init(jade);

    var fn = jade.compileFile('test/fixtures/phptest2.jade', 
      {
        usestrip: true,
        pretty: true,
        prefunction: function(input/*, options*/) {
          return input.replace(/\$\$+/, "#{data.domain}"); 
        },
      });
    var php = fn({data: { domain: "mytextdomain" } });
    var expected = grunt.file.read('test/expected/phptest2.php');
    test.equal(php, expected);
    test.done();

    jade4php.restore();

  },
};
