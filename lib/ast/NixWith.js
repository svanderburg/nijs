/**
 * @class NixWith
 * @extends NixObject
 *
 * Captures the abstract syntax of a Nix with block importing variables of the
 * attribute set parameter into the lexical scope of the body
 */

var inherit = require('./util/inherit.js').inherit;
var NixObject = require('./NixObject.js').NixObject;
var nijs = require('../nijs.js');

/**
 * @constructor
 * Creates a new NixWith instance.
 *
 * @param {Object} args Arguments to this function
 * @param {Object} args.withExpr An expression yielding an attribute set
 * @param {Object} args.body Body of the let block containing an arbitrary expression in which the members of the attribute set are imported
 */
 
function NixWith(args) {
    this.withExpr = args.withExpr;
    this.body = args.body;
}

/* NixWith inherits from NixObject */
inherit(NixObject, NixWith);

/**
 * @see NixObject#toNixExpr
 */
NixWith.prototype.toNixExpr = function() {
    
    return "with "+nijs.jsToNix(this.withExpr)+";\n"+
    nijs.jsToNix(this.body);
};

exports.NixWith = NixWith;
