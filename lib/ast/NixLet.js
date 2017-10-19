var inherit = require('./util/inherit.js').inherit;
var NixBlock = require('./NixBlock.js').NixBlock;
var nijs = require('../nijs.js');

/**
 * Creates a new NixLet instance.
 *
 * @class NixLet
 * @extends NixBlock
 * @classdesc Captures the abstract syntax of a Nix let block containing local variables.
 *
 * @constructor
 * @param {Object} args Arguments to this function
 * @param {Object} args.value An arbitrary object that should be represented as a let block. This object is stored as a reference.
 * @param {Object} args.body Body of the let block containing an expression that should get evaluated
 */
function NixLet(args) {
    this.value = args.value;
    this.body = args.body;
}

/* NixLet inherits from NixBlock */
inherit(NixBlock, NixLet);

/**
 * @see NixObject#toNixExpr
 */
NixLet.prototype.toNixExpr = function(indentLevel, format) {
    var indentation = nijs.generateIndentation(indentLevel, format);

    return "let\n" +
        nijs.objectMembersToAttrsMembers(this.value, indentLevel + 1, format) +
        indentation + "in\n" +
        indentation + nijs.jsToIndentedNix(this.body, indentLevel, format);
};

exports.NixLet = NixLet;
