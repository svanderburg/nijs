/**
 * @class NixStorePath
 * @extends NixValue
 *
 * A Nix object that represents a reference to a file that resides in the Nix
 * store. This object is useful to directly refer to something that is in the
 * Nix store, without copying it.
 */

var path = require('path');
var inherit = require('./util/inherit.js').inherit;
var NixValue = require('./NixValue.js').NixValue;

/**
 * @constructor
 * Creates a new NixStorePath instance.
 *
 * @param {String} value An absolute path to a Nix store file
 */

function NixStorePath(value) {
    NixValue.call(this, value);
};

/* NixStorePath inherits from NixValue */
inherit(NixValue, NixStorePath);

/**
 * @see NixObject#toNixExpr
 */
NixStorePath.prototype.toNixExpr = function(indentLevel) {
    return "builtins.storePath " + this.value;
};

exports.NixStorePath = NixStorePath;
