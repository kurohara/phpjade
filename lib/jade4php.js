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
    var isConstant = require('constantinople');

    function assertExpression(exp) {
        // this verifies that a JavaScript expression is valid
		// no check is applied, now.
        return exp;
    }

    // Precisa sobrescrever para retirar validação JS
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
        var val = code.val;

        if (code.buffer) {
            if (code.escape) {
                val = 'htmlspecialchars(' + val + ', ENT_QUOTES, \'UTF-8\')';
            }

            val = 'echo ' + val + ';' ;
        }

        if (this.pp) {
          this.prettyIndent(1, true);
        }
        this.buffer('<?php ' + val + ' ?>', false);

        if (code.block) {
            if (!code.buffer) { this.buf.push('{'); }
            this.visit(code.block);
            if (!code.buffer) { this.buf.push('}'); }
        }
    };

    function stripquotes(src) {
       var re = /['"](.*)['"]/ ;
       var result = re.exec(src);
       if (result.length > 1) {
         return result[1];
       } else {
         return src;
       }
    }

    jade.Compiler.prototype.attrs = function(attrs, buffer) {
      for (var index = attrs.length - 1;index >= 0;--index) {
          var attr = attrs[index];
          var key = attr.name;
          var escaped = attr.escaped;
          var val = attr.val;
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
          if (this.options.usestrip && key.lastIndexOf('__pairstrip', 0) === 0) {
              // support __pairstrip attribute
              val = stripquotes(val);

              attrs.splice(index, 1);
              if(buffer) {
                  this.buffer(" " + val + " ");
              } else {
                  buffer.push(" " + val + " ");
              }
          }
      }

      return this.super.attrs.call(this, attrs, buffer);

    };

};

