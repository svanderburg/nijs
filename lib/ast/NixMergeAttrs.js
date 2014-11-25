/**
 * @class NixFunInvocation
 * @extends NixBlock
 *
 * Captures the abstract syntax of the Nix attribute set merge operator //
 * which merges the fields of two sets together. If there are duplicate key
 * names the latter takes precedence over the former.
 */

var inherit = require('./util/inherit.js').inherit;
var NixBlock = require('./NixBlock.js').NixBlock;
var nijs = require('../nijs.js');

/**
 * @constructor
 * Creates a new NixMergeAttrs instance.
 *
 * @param {Object} args Arguments to this function
 * @param {Mixed} args.left An object yielding an attribute set
 * @param {Mixed} args.right An object yielding an attribute set
 */

function NixMergeAttrs(args) {
    this.left = args.left;
    this.right = args.right;
}

/* NixMergeAttrs inherits from NixBlock */
inherit(NixBlock, NixMergeAttrs);

/**
 * @see NixObject#toNixExpr
 */
NixMergeAttrs.prototype.toNixExpr = function(indentLevel, format) {
    
    /* Generate the sub expression that yields the left attribute set */
    var leftExpr = nijs.jsToIndentedNix(this.left, indentLevel, format);
    
    if(this.left instanceof nijs.NixBlock) { // Some objects require ( ) around them to make them work
        leftExpr = this.left.wrapInParenthesis(leftExpr);
    }
    
    /* Generate the sub expression that yields the right attribute set */
    var rightExpr = nijs.jsToIndentedNix(this.right, indentLevel, format);
    
    if(this.right instanceof nijs.NixBlock) { // Some objects require ( ) around them to make them work
        rightExpr = this.right.wrapInParenthesis(rightExpr);
    }
    
    /* Return the generated sub expression */
    return leftExpr + " // " + rightExpr;
};

exports.NixMergeAttrs = NixMergeAttrs;
