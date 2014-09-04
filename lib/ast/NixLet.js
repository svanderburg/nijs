/**
 * @class NixLet
 * @extends NixValue
 *
 * Captures the abstract syntax of a Nix let block containing local variables.
 */

var inherit = require('./util/inherit.js').inherit;
var NixValue = require('./NixValue.js').NixValue;
var nijs = require('../nijs.js');

/**
 * @constructor
 * Creates a new NixLet instance.
 *
 * @param {Object} args Arguments to this function
 * @param {Object} args.value An arbitrary object that should be represented as a let block. This object is stored as a reference.
 * @param {Object} args.body Body of the let block containing an expression that should get evaluated
 */
function NixLet(args) {
    NixValue.call(this, args.value);
    this.body = args.body;
}

/* NixLet inherits from NixValue */
inherit(NixValue, NixLet);

/**
 * @see NixObject#toNixExpr
 */
NixLet.prototype.toNixExpr = function(indentLevel) {
    var indentation = nijs.generateIndentation(indentLevel);

    return "let\n" +
        nijs.objectMembersToAttrsMembers(this.value, indentLevel + 1) +
        indentation + "in\n" +
        indentation + nijs.jsToIndentedNix(this.body, indentLevel);
};

exports.NixLet = NixLet;
