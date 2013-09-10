/**
 * @class NixExpression
 * @extends NixValue
 *
 * A Nix object that contains an already generated Nix expression.
 */

var inherit = require('./inherit.js').inherit;
var NixValue = require('./NixValue.js').NixValue;
 
/**
 * @constructor
 * Creates a new NixExpression instance.
 *
 * @param {String} value Value containing a Nix expression
 */
function NixExpression(value) {
    NixValue.call(this, value);
};

/* NixExpression inherits from NixValue */
inherit(NixValue, NixExpression);

/**
 * @see NixObject#toNixExpr
 */
NixExpression.prototype.toNixExpr = function() {
    return "(" + this.value + ")";
};

exports.NixExpression = NixExpression;
