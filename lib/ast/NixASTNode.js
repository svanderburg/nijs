var nijs = require('nijs');
var NixObject = require('./NixObject.js').NixObject;
var inherit = require('./util/inherit.js').inherit;

/**
 * Creates a new NixASTNode instance.
 *
 * @class NixASTNode
 * @extends NixObject
 * @classdesc Defines an AST node that is composed of an arbitrary data
 * structure that can be translated into a Nix expression. This prototype is
 * supposted to be extended by arbitrary classes so that they can expose its
 * properties as a Nix expression.
 *
 * @constructor
 */
function NixASTNode(obj) {
    if(obj !== undefined && typeof obj.toNixAST === "function") {
        this.toNixAST = obj.toNixAST;
    }
}

/* NixASTNode inherits from NixObject */
inherit(NixObject, NixASTNode);

/**
 * Returns an arbitrary data structure that will be translated into a Nix
 * expression.
 *
 * @method
 * @return {Object} Arbitrary data structure
 */
NixASTNode.prototype.toNixAST = function() {
    throw "toNixAST() is not implemented, please use a prototype that inherits from NixASTNode or provide an object with a toNixAST() function as a property as constructor parameter";
};

/**
 * @see NixObject#toNixExpr
 */
NixASTNode.prototype.toNixExpr = function(indentLevel, format) {
    return nijs.jsToIndentedNix(this.toNixAST(), indentLevel, format);
};

exports.NixASTNode = NixASTNode;
