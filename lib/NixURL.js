/**
 * @class NixURL
 * @extends NixValue
 *
 * A Nix URL object that gets validated by the Nix expression evaluator.
 */

var inherit = require('./inherit.js').inherit;
var NixValue = require('./NixValue.js').NixValue;

/**
 * @constructor
 * Creates a new NixURL instance.
 *
 * @param {String} value Value containing a URL
 */
function NixURL(value) {
    NixValue.call(this, value);
};

/* NixURL inherits from NixValue */
inherit(NixValue, NixURL);

/**
 * @see NixObject#toNixExpr
 */
NixURL.prototype.toNixExpr = function() {
    return this.value;
};

exports.NixURL = NixURL;
