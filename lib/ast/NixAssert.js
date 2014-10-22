/**
 * @class NixAssert
 * @extends NixBlock
 *
 * Captures the abstract syntax of a Nix of an assert statement.
 */

var inherit = require('./util/inherit.js').inherit;
var NixBlock = require('./NixBlock.js').NixBlock;
var nijs = require('../nijs.js');

/**
 * @constructor
 * Creates a new NixAssert instance.
 *
 * @param {Object} args Arguments to this function
 * @param {Mixed} args.conditionExpr An object representing an expression evaluating to a boolean
 * @param {Mixed} args.body Expression that gets evaluated if the condition is true. If it is false, the evaluation aborts with an error.
 */
function NixAssert(args) {
    this.conditionExpr = args.conditionExpr;
    this.body = args.body;
}

/* NixAssert inherits from NixBlock */
inherit(NixBlock, NixAssert);

/**
 * @see NixObject#toNixExpr
 */
NixAssert.prototype.toNixExpr = function(indentLevel, format) {
    return "assert " + nijs.jsToIndentedNix(this.conditionExpr, indentLevel, format) + ";\n" +
        nijs.generateIndentation(indentLevel, format) + nijs.jsToIndentedNix(this.body, indentLevel, format)
};

exports.NixAssert = NixAssert;
