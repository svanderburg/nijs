var inherit = require('./util/inherit.js').inherit;
var NixValue = require('./NixValue.js').NixValue;

/**
 * Creates a new NixExpression instance.
 *
 * @class NixExpression
 * @extends NixValue
 * @classdesc A Nix object that contains an already generated Nix expression.
 *
 * @constructor
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
NixExpression.prototype.toNixExpr = function(indentLevel, format) {
    return this.value;
};

exports.NixExpression = NixExpression;
