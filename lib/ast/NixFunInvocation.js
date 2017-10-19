var inherit = require('./util/inherit.js').inherit;
var NixBlock = require('./NixBlock.js').NixBlock;
var nijs = require('../nijs.js');

/**
 * Creates a new NixFunInvocation instance.
 *
 * @class NixFunInvocation
 * @extends NixBlock
 * @classdesc Captures the abstract syntax of a Nix function invocation
 * consisting of an expression yielding a function definition and an expression
 * capturing the parameter.
 *
 * @constructor
 * @param {Object} args Arguments to this function
 * @param {Mixed} args.funExpr An object representing an expression that yields a function definition
 * @param {Mixed} args.paramExpr An object representing an expression that yields the function parameter
 */

function NixFunInvocation(args) {
    this.funExpr = args.funExpr;
    this.paramExpr = args.paramExpr;
}

/* NixFunInvocation inherits from NixBlock */
inherit(NixBlock, NixFunInvocation);

/**
 * @see NixObject#toNixExpr
 */
NixFunInvocation.prototype.toNixExpr = function(indentLevel, format) {

    /* Generate the sub expression that yields the function definition */
    var funExprStr = nijs.jsToIndentedNix(this.funExpr, indentLevel, format);

    if(this.funExpr instanceof nijs.NixBlock && !(this.funExpr instanceof nijs.NixFunInvocation)) { // Some objects require ( ) around them to make them work
        funExprStr = this.funExpr.wrapInParenthesis(funExprStr);
    }

    /* Generate the sub expression that yields the parameter */
    var paramExprStr = nijs.jsToIndentedNix(this.paramExpr, indentLevel, format);

    if(this.paramExpr instanceof nijs.NixBlock) { // Some objects require ( ) around them to make them work
        paramExprStr = this.paramExpr.wrapInParenthesis(paramExprStr);
    }

    /* Return the generated sub expression */
    return funExprStr + " " + paramExprStr;
};

exports.NixFunInvocation = NixFunInvocation;
