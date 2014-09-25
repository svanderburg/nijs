/**
 * @class NixBlock
 * @extends NixObject
 *
 * Creates a Nix block object that contains a sub expression that might need
 * parenthesis ( ) around them in certain contexts, such as a list.
 */

var inherit = require('./util/inherit.js').inherit; 
var NixObject = require('./NixObject.js').NixObject;

/**
 * @constructor
 * Creates a new NixBlock instance.
 */
function NixBlock() {
};

/* NixBlock inherits from NixObject */
inherit(NixObject, NixBlock);

/**
 * Wraps an expression in a block within parenthesis.
 *
 * @param {String} expr String containing a Nix expression block
 * @return {String} The same expression within parenthesis
 */
NixBlock.prototype.wrapInParenthesis = function(expr) {
    return "(" + expr + ")";
};

exports.NixBlock = NixBlock;
