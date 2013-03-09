/**
 * @class NixURL
 * @extends NixObject
 *
 * A Nix URL object that gets validated by the Nix expression evaluator.
 */

var inherit = require('./inherit.js').inherit;
var NixObject = require('./NixObject.js').NixObject;

/**
 * @constructor
 * Creates a new NixURL instance.
 *
 * @param {String} value Value containing a URL
 */
function NixURL(value) {
    NixObject.call(this, value);
};

inherit(NixObject, NixURL);

exports.NixURL = NixURL;
