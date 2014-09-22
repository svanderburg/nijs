/**
 * @class NixStorePath
 * @extends NixFunInvocation
 *
 * A Nix object that represents a reference to a file that resides in the Nix
 * store. This object is useful to directly refer to something that is in the
 * Nix store, without copying it.
 */

var path = require('path');
var inherit = require('./util/inherit.js').inherit;
var NixFunInvocation = require('./NixFunInvocation.js').NixFunInvocation;
var NixExpression = require('./NixExpression.js').NixExpression;

/**
 * @constructor
 * Creates a new NixStorePath instance.
 *
 * @param {String} value A sub expression referring to a Nix store file
 */

function NixStorePath(value) {
    NixFunInvocation.call(this, {
        funExpr: new NixExpression("builtins.storePath"),
        paramExpr: value
    });
};

/* NixStorePath inherits from NixFunInvocation */
inherit(NixFunInvocation, NixStorePath);

exports.NixStorePath = NixStorePath;
