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

Modifier.prototype.override = function(jade) {
    // for debug purpose
    // var sys = require('sys');

    function appendSemicolon(code) {
      if (! code.trim().match(/[;:]$/)) {
        return code + ";";
      } else {
        return code;
      }
    }

    function deleteSemicolon(code) {
      return code.replace(/(.*);[ \t]*$/, "$1");
    }

    var isConstant = require('constantinople');

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

    jade.Parser.prototype.parseCode = function(afterIf) {
      var node = this.super.parseCode.call(this, afterIf);
      return node;
    };

    jade.Compiler.prototype.visitCode = function (code) {
        var val = deleteSemicolon(code.val);

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

    function removeSurroundings(src) {
       return src.replace(/['"](.*)['"]/ ,"$1").replace(/[-]{0,1}(.*)/, "$1");
    }

    jade.Compiler.prototype.attrs = function(attrs, buffer) {
      for (var index = attrs.length - 1;index >= 0;--index) {
          var attr = attrs[index];
          var key = attr.name;
          var escaped = attr.escaped;
          var val = deleteSemicolon(attr.val);

          if (this.options.usestrip && key.match(/^__+$/)) {
              val = removeSurroundings(val);
              if(buffer) {
                  this.buffer(" <?php " + val + "; ?> ", true);
              } else {
                  buffer.push(" <?php " + val + "; ?> ");
              }
              // remove this from attrs list.
              attrs.splice(index, 1);
          } else
          if (!isConstant(val)) {
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

Modifier.prototype.addFilter = function(jade) {
	if (jade) {
		jade.filters.php = function(block) {
			if (this.pp) {
				return "<?php \n" + block + "\n?>";
			} else {
				return "<?php " + block + "?>";
			}
		};
	}
};

