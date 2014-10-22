/**
 * @class NixIf
 * @extends NixBlock
 *
 * Captures the abstract syntax of a Nix of if-then-else statement.
 */

var inherit = require('./util/inherit.js').inherit;
var NixBlock = require('./NixBlock.js').NixBlock;
var nijs = require('../nijs.js');

/**
 * @constructor
 * Creates a new NixIf instance.
 *
 * @param {Object} args Arguments to this function
 * @param {Mixed} args.ifExpr An object representing an expression evaluating to a boolean
 * @param {Mixed} args.thenExpr Expression that gets evaluated if the condition is true
 * @param {Mixed} args.elseExpr Expression that gets evaluated if the condition is false
 */
function NixIf(args) {
    this.ifExpr = args.ifExpr;
    this.thenExpr = args.thenExpr;
    this.elseExpr = args.elseExpr;
}

/* NixIf inherits from NixBlock */
inherit(NixBlock, NixIf);

/**
 * @see NixObject#toNixExpr
 */
NixIf.prototype.toNixExpr = function(indentLevel, format) {
    return "if " + nijs.jsToIndentedNix(this.ifExpr, indentLevel, format) +
        " then " + nijs.jsToIndentedNix(this.thenExpr, indentLevel, format) +
        " else " + nijs.jsToIndentedNix(this.elseExpr, indentLevel, format);
};

exports.NixIf = NixIf;
