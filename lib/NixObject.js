/**
 * @class NixObject
 * Creates a Nix object that captures common properties for Nix language
 * constructs for which is no equivalent JavaScript type available.
 */
 
/**
 * @constructor
 * Creates a new NixObject instance.
 *
 * @param {Mixed} value Value of the reference
 */
function NixObject(value) {
    this.value = value;
};

exports.NixObject = NixObject;
