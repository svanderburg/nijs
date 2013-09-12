/**
 * @class NixValue
 * @extends NixObject
 *
 * Creates a Nix value object that captures common properties of value objects
 * in the Nix expression language, for which is no equivalent JavaScript object
 * available.
 */

var inherit = require('./util/inherit.js').inherit; 
var NixObject = require('./NixObject.js').NixObject;

/**
 * @constructor
 * Creates a new NixValue instance.
 *
 * @param {Mixed} value Value of the reference
 */
function NixValue(value) {
    this.value = value;
};

/* NixValue inherits from NixObject */
inherit(NixObject, NixValue);

exports.NixValue = NixValue;
