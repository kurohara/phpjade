/**
 * modifier.js
 * part of jade4jsp, the sample modifier for jade.
 * Written by "Hiroyoshi Kurohara<kurohara@yk.rim.or.jp>".
 *
 */

//
// subclasses for jade classes.
var Compiler = function Compiler() { };
var Lexer = function Lexer() { };
var Parser = function Parser() { };

//
// The Modifier Class.
var Modifier = module.exports = function Modifier() {
	this.Compiler = Compiler;
	this.Lexer = Lexer;
	this.Parser = Parser;
};


/**
 * make copy of self to temporary parent.
 * then make itself subclass.
 */
function selfsubclass(self, tmpparent) {
	for (var key in self.prototype) {
		tmpparent.prototype[key] = self.prototype[key];
	}
    self.prototype.super = tmpparent.prototype;
}

function hasParent(jade) {
	return jade.Compiler.super;
}

function isParentOurs(jade) {
	return jade.Compiler.super === Compiler.prototype;
}

Modifier.prototype.Modifier = Modifier;

Modifier.prototype.override = function(jade) { if (jade) { return this; } };

Modifier.prototype.addFilter = function(jade) { if (jade) { return this;} };

Modifier.prototype.init = function(jade) {
	this.jade = jade;
	if (!hasParent(jade) || !isParentOurs(jade)) {
		selfsubclass(jade.Compiler, Compiler);
		selfsubclass(jade.Lexer, Lexer);
		selfsubclass(jade.Parser, Parser);
	
		this.override(jade);
		this.addFilter(jade);
	}
};

Modifier.prototype.restore = function() {
	[ 'Compiler', 'Lexer', 'Parser' ].forEach(function(objname) {
		for (var key in this.jade[objname].prototype) {
			this.jade[objname].prototype[key] = this.jade[objname].prototype.super[key];
		}
	}.bind(this));
};
 
