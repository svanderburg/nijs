/**
 * @class NixObject
 * Creates a Nix object that captures properties of Nix expression language
 * constructs for which no JavaScript equivalent is available.
 */
 
/**
 * @constructor
 * Creates a new NixObject instance.
 */
function NixObject() {
};

/**
 * Converts the Nix object to a string containing the equivalent Nix expression
 
 * @return String with the equivalent Nix expression
 */
NixObject.prototype.toNixExpr = function() {
    throw "toNixExpr() is not implemented, please use a prototype that properly inherits from NixObject";
};

exports.NixObject = NixObject;
