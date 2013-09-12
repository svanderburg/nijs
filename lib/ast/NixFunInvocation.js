/**
 * @class NixFunInvocation
 * @extends NixObject
 *
 * Captures the abstract syntax of a Nix function invocation consisting of an
 * expression yielding a function definition and an expression capturing the
 * parameter.
 */

var inherit = require('./util/inherit.js').inherit;
var NixObject = require('./NixObject.js').NixObject;
var nijs = require('../nijs.js');

/**
 * @constructor
 * Creates a new NixFunInvocation instance.
 *
 * @param {Object} args Arguments to this function
 * @param {Mixed} args.funExpr An object representing an expression that yields a function definition
 * @param {Mixed} args.paramExpr An object representing an expression that yields the function parameter
 */

function NixFunInvocation(args) {
    this.funExpr = args.funExpr;
    this.paramExpr = args.paramExpr;
}

/* NixFunInvocation inherits from NixObject */
inherit(NixObject, NixFunInvocation);

/**
 * @see NixObject#toNixExpr
 */
NixFunInvocation.prototype.toNixExpr = function() {
    return "(" + nijs.jsToNix(this.funExpr) + " " + nijs.jsToNix(this.paramExpr) + ")";
};

exports.NixFunInvocation = NixFunInvocation;
