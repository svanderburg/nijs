/**
 * @class NixAttrReference
 * @extends NixObject
 *
 * Captures the abstract syntax of a Nix of an expression yielding an attribute
 * set and an expression yielding an attribute name that references a member of
 * the former attribute set.
 */

var inherit = require('./util/inherit.js').inherit;
var NixObject = require('./NixObject.js').NixObject;
var nijs = require('../nijs.js');

/**
 * @constructor
 * Creates a new NixAttrReference instance.
 *
 * @param {Object} args Arguments to this function
 * @param {Mixed} args.attrSetExpr An object representing an expression that yields an attribute set
 * @param {Mixed} args.refExpr An object representing an expression that yields an attribute name
 * @param {Mixed} args.orExpr An optional object representing an expression that gets evaluated if the reference does not exist.
 */
function NixAttrReference(args) {
    this.attrSetExpr = args.attrSetExpr;
    this.refExpr = args.refExpr;
    this.orExpr = args.orExpr;
}

/* NixAttrReference inherits from NixObject */
inherit(NixObject, NixAttrReference);

/**
 * @see NixObject#toNixExpr
 */
NixAttrReference.prototype.toNixExpr = function(indentLevel, format) {
    
    /* Generate the sub expression that yields the attribute set */
    var attrSetExprStr = nijs.jsToIndentedNix(this.attrSetExpr, indentLevel, format);
    
    if(this.attrSetExpr instanceof nijs.NixBlock) { // Some object require ( ) around them to make them work
        attrSetExprStr = this.attrSetExpr.wrapInParenthesis(attrSetExprStr);
    }
    
    /* Generate the sub expression that yields the parameter */
    var refExprStr = nijs.jsToIndentedNix(this.refExpr, indentLevel, format);
    
    if(this.refExpr instanceof nijs.NixBlock) { // Some objects require ( ) around them to make them work
        refExprStr = this.refExpr.wrapInParenthesis(refExprStr);
    }
    
    /* Generate the or expression that gets evaluated if the reference does not exist */
    var orExprStr;
    
    if(this.orExpr === undefined) {
        orExprStr = "";
    } else {
        orExprStr = nijs.jsToIndentedNix(this.orExpr, indentLevel, format);
        
        if(this.orExpr instanceof nijs.NixBlock) { // Some objects require ( ) around them to make them work
            orExprStr = this.orExpr.wrapInParenthesis(orExprStr);
        }
        
        orExprStr = " or " + orExprStr;
    }
    
    /* Return the generated sub expression */
    return attrSetExprStr + "." + refExprStr + orExprStr;
};

exports.NixAttrReference = NixAttrReference;
