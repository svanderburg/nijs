var inherit = require('./util/inherit.js').inherit; 
var NixObject = require('./NixObject.js').NixObject;

/**
 * Creates a new NixValue instance.
 *
 * @class NixValue
 * @extends NixObject
 * @classdesc Creates a Nix value object that captures common properties of
 * value objects in the Nix expression language, for which is no equivalent
 * JavaScript object available.
 *
 * @constructor
 * @param {Mixed} value Value of the reference
 */
function NixValue(value) {
    this.value = value;
};

/* NixValue inherits from NixObject */
inherit(NixObject, NixValue);

exports.NixValue = NixValue;
