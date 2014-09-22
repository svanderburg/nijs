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
NixFunInvocation.prototype.toNixExpr = function(indentLevel) {
    
    /* Generate the sub expression that yields the function definition */
    var funExprStr = nijs.jsToIndentedNix(this.funExpr, indentLevel);
    
    if(this.funExpr instanceof nijs.NixFunction) { // Function definitions require ( ) around them to make them work
        funExprStr = "(" + funExprStr + ")";
    }
    
    /* Generate the sub expression that yields the parameter */
    var paramExprStr = nijs.jsToIndentedNix(this.paramExpr, indentLevel);
    
    if((this.paramExpr instanceof nijs.NixFunction) || (this.paramExpr instanceof nijs.NixFunInvocation)) { // Function definitions and function invocations require ( ) around them to make them work
        paramExprStr = "(" + paramExprStr + ")";
    }
    
    /* Return the generated sub expression */
    return funExprStr + " " + paramExprStr;
};

exports.NixFunInvocation = NixFunInvocation;
