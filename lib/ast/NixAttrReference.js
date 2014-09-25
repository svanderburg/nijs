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
NixAttrReference.prototype.toNixExpr = function(indentLevel) {
    
    /* Generate the sub expression that yields the attribute set */
    var attrSetExprStr = nijs.jsToIndentedNix(this.attrSetExpr, indentLevel);
    
    if((this.attrSetExpr instanceof nijs.NixFunction) || (this.attrSetExpr instanceof nijs.NixFunInvocation)) { // Function definitions and function invocations require ( ) around them to make them work
        attrSetExprStr = "(" + attrSetExprStr + ")";
    }
    
    /* Generate the sub expression that yields the parameter */
    var refExprStr = nijs.jsToIndentedNix(this.refExpr, indentLevel);
    
    if((this.refExpr instanceof nijs.NixFunction) || (this.refExpr instanceof nijs.NixFunInvocation)) { // Function definitions and function invocations require ( ) around them to make them work
        refExprStr = "(" + refExprStr + ")";
    }
    
    /* Generate the or expression that gets evaluated if the reference does not exist */
    var orExpr;
    
    if(this.orExpr === undefined) {
        orExpr = "";
    } else {
        orExpr = nijs.jsToIndentedNix(this.orExpr, indentLevel);
        
        if((this.refExpr instanceof nijs.NixFunction) || (this.refExpr instanceof nijs.NixFunInvocation)) { // Function definitions and function invocations require ( ) around them to make them work
            orExpr = "(" + orExpr + ")";
        }
        
        orExpr = " or "+orExpr;
    }
    
    /* Return the generated sub expression */
    return attrSetExprStr + "." + refExprStr + orExpr;
};

exports.NixAttrReference = NixAttrReference;
