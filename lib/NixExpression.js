/**
 * @class NixExpression
 * @extends NixObject
 *
 * A Nix object that contains an already generated Nix expression.
 */

var inherit = require('./inherit.js').inherit;
var NixObject = require('./NixObject.js').NixObject;
 
/**
 * @constructor
 * Creates a new NixExpression instance.
 *
 * @param {String} value Value containing a Nix expression
 */
function NixExpression(value) {
    NixObject.call(this, value);
};

inherit(NixObject, NixExpression);

exports.NixExpression = NixExpression;
