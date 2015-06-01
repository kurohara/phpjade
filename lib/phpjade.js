/*
 * jade4php
 * https://github.com/kurohara/jade4php
 *
 * Copyright (c) 2015 kurohara
 * Licensed under the MIT license.
 */

'use strict';

var Modifier = require('./modifier');
module.exports = new Modifier();

/**
 * call prefunction passed from options.
 * 'prefunction' does cumbersome preprocess just after php part of code found.
 */
function php_prefunc(input, options) {
  if (options.prefunction) {
    return options.prefunction(input, options);
  } else {
    return input;
  }
}

Modifier.prototype.override = function(jade) {
    // for debug purpose
    // var sys = require('sys');


    /**
     * append semicolon so that the line become correct php line of code.
     */
    function appendSemicolon(code) {
      if (! code.trim().match(/[;:]$/)) {
        return code + ";";
      } else {
        return code;
      }
    }

    /**
     * delete tailing semicolon.
     */
    function deleteSemicolon(code) {
      return code.replace(/(.*);[ \t]*$/, "$1");
    }

    var isConstant = require('constantinople');

    /**
     * check if the expression is correct(in php syntax).
     * currently, do nothing.
     */
    function assertExpression(exp) {
        // this verifies that a JavaScript expression is valid
		// no check is applied, now.
        return exp;
    }

	// moved from Jade to call my own 'assertExpression'.
    jade.Lexer.prototype.code = function () {
        var captures;
        if (captures = /^(!?=|-)[ \t]*([^\n]+)/.exec(this.input)) {
            this.consume(captures[0].length);
            var flags = captures[1];
            captures[1] = captures[2];
            var tok = this.tok('code', captures[1]);
            tok.flags = flags;
            tok.escape = flags.charAt(0) === '=';
            tok.buffer = flags.charAt(0) === '=' || flags.charAt(1) === '=';
            if (tok.buffer) { assertExpression(captures[1]); }
            return tok;
        }
    };

    /**
     * override the code to parse the 'code' part of jade source.
     * currently, this code does nothing(just calls original code).
     */
    jade.Parser.prototype.parseCode = function(afterIf) {
      var node = this.super.parseCode.call(this, afterIf);
      return node;
    };

    /**
     * processes 'code' part of jade source.
     */
    jade.Compiler.prototype.visitCode = function (code) {
        var val = deleteSemicolon(code.val);
        val = php_prefunc(val, this.options);

        if (code.buffer) {
            if (code.escape) {
                val = 'htmlspecialchars(' + val + ', ENT_QUOTES, \'UTF-8\')';
            }

            val = 'echo ' + val + ';' ;
        }
        val = appendSemicolon(val);
        if (this.pp) {
          this.prettyIndent(1, true);
        }
        this.buffer('<?php ' + val + ' ?>', true);

        if (code.block) {
            if (!code.buffer) { this.buf.push('{'); }
            this.visit(code.block);
            if (!code.buffer) { this.buf.push('}'); }
        }
    };

    /**
     * removes surrounding symbols("'-).
     */
    function removeSurroundings(src) {
       return src.replace(/['"](.*)['"]/ ,"$1").replace(/[-]{0,1}(.*)/, "$1");
    }

    /**
     * processes attribute parts.
     */
    jade.Compiler.prototype.attrs = function(attrs, buffer) {
      for (var index = attrs.length - 1;index >= 0;--index) {
          var attr = attrs[index];
          var key = attr.name;
          var escaped = attr.escaped;
          var val = deleteSemicolon(attr.val);

          if (this.options.usestrip && key.match(/^__+$/)) {
              val = removeSurroundings(val);
              val = php_prefunc(val, this.options);
              if(buffer) {
                  this.buffer(" <?php " + val + "; ?> ", true);
              } else {
                  buffer.push(" <?php " + val + "; ?> ");
              }
              // remove this from attrs list.
              attrs.splice(index, 1);
          } else
          if (!isConstant(val)) {
              val = php_prefunc(val, this.options);
              var needEcho = true;
              if (val.substring(0,1) === '-') {
                  needEcho = false;
                  val = val.substring(1);
              }
              
              if (escaped && needEcho) {
                  val = 'htmlspecialchars(' + val + ', ENT_QUOTES, \'UTF-8\')';
              }

              if (needEcho) {
                  val = '"<?php echo ' + val + '; ?>"';
              } else {
                  val = '"<?php ' + val + '; ?>"';
              }

              attr.escaped = false;
              attr.val = val;
          }
      }

      return this.super.attrs.call(this, attrs, buffer);

    };

};

/**
 * filter function for Jade.
 * Here defines ':php' filter.
 */
Modifier.prototype.addFilter = function(jade) {
	if (jade) {
		jade.filters.php = function(block) {
            var stack = require('stack-trace').get();
            var compiler = stack[2];
            if (compiler && compiler.options) {
              block = php_prefunc(block, compiler.options);
            }
			if (compiler && compiler.options && compiler.options.pretty) {
				return "<?php \n" + block + "\n?>";
			} else {
				return "<?php " + block + "?>";
			}
		};
	}
};

