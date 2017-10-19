var url = require('url');
var inherit = require('./util/inherit.js').inherit;
var NixValue = require('./NixValue.js').NixValue;

/**
 * Creates a new NixURL instance.
 *
 * @class NixURL
 * @extends NixValue
 * @classdesc A Nix URL object that gets validated by the Nix expression evaluator.
 *
 * @constructor
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
NixURL.prototype.toNixExpr = function(indentLevel, format) {
    var parsedURL = url.parse(this.value);
    
    if(parsedURL.href.indexOf('#') == -1)
        return parsedURL.href;
    else
        return '"' + parsedURL.href + '"'; // If the URL contains # symbol, then return a string. Otherwise, Nix sees it as a comment.
};

exports.NixURL = NixURL;
