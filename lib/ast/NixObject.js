/**
 * Creates a new NixObject instance.
 *
 * @class NixObject
 * @classdesc Creates a Nix object that captures properties of Nix expression
 * language constructs for which no JavaScript equivalent is available.
 *
 * @constructor
 */
function NixObject() {
};

/**
 * Converts the Nix object to a string containing the equivalent Nix expression
 *
 * @method
 * @param {Number} indentLevel The indentation level of the resulting sub expression
 * @param {Boolean} format Indicates whether to nicely format to expression (i.e. generating whitespaces) or not
 * @return {String} String with the equivalent Nix expression
 */
NixObject.prototype.toNixExpr = function(indentLevel, format) {
    throw "toNixExpr() is not implemented, please use a prototype that inherits from NixObject";
};

exports.NixObject = NixObject;
