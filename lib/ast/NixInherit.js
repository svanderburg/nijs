/**
 * @class NixInherit
 * @extends NixObject
 *
 * Captures the abstract syntax of a Nix inherit statement that imports a value
 * into the current lexical scope. Inheriting value `a` is semantically
 * equivalent to the assignment `a = a` in the Nix expression language.
 */

var inherit = require('./util/inherit.js').inherit;
var NixObject = require('./NixObject.js').NixObject;

/**
 * @constructor
 * Creates a new NixInherit instance.
 *
 * @param {String} scope Name of the scope or undefined to inherit from the current lexical scope
 */
function NixInherit(scope) {
    this.scope = scope;
}

/* NixInherit inherits from NixObject */
inherit(NixObject, NixInherit);

/**
 * @see NixObject#toNixExpr
 */
NixInherit.prototype.toNixExpr = function(indentLevel) {
    var expr = "inherit";
    
    if(this.scope !== undefined) {
        expr += " (" + this.scope + ")";
    }
    
    return expr;
};

/**
 * Checks whether this object is equal to another NixInherit object.
 *
 * @return {Boolean} true, if and only if, both objects have the same properties and inherit from the same prototype.
 */
NixInherit.prototype.equals = function(nixInherit) {
    return (nixInherit instanceof NixInherit && this.scope === nixInherit.scope);
};

exports.NixInherit = NixInherit;
