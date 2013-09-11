/**
 * @class NixLet
 * @extends NixValue
 *
 * Captures the abstract syntax of a Nix let block containing local variables.
 */

var inherit = require('./inherit.js').inherit;
var NixValue = require('./NixValue.js').NixValue;
var nijs = require('./nijs.js');

/**
 * @constructor
 * Creates a new NixLet instance.
 *
 * @param {Object} value An arbitrary object that should be represented as a let block. This object is stored as a reference.
 */
function NixLet(value, body) {
    NixValue.call(this, value);
    this.body = body;
}

/* NixLet inherits from NixValue */
inherit(NixValue, NixLet);

/**
 * @see NixObject#toNixExpr
 */
NixLet.prototype.toNixExpr = function() {
    
    return "let\n" +
    nijs.objectMembersToAttrsMembers(this.value) +
    "\nin\n" +
    nijs.jsToNix(this.body);
};

exports.NixLet = NixLet;
