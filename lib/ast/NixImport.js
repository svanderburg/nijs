/**
 * @class NixImport
 * @extends NixFunInvocation
 *
 * A Nix object that imports an external Nix expression file referring to a Nix
 * expression file.
 */

var path = require('path');
var inherit = require('./util/inherit.js').inherit;
var NixFunInvocation = require('./NixFunInvocation.js').NixFunInvocation;
var NixExpression = require('./NixExpression.js').NixExpression;

/**
 * @constructor
 * Creates a new NixImport instance.
 *
 * @param {String} value A sub expression referring to an external Nix expression file
 */

function NixImport(value) {
    NixFunInvocation.call(this, {
        funExpr: new NixExpression("import"),
        paramExpr: value
    });
};

/* NixImport inherits from NixFunInvocation */
inherit(NixFunInvocation, NixImport);

exports.NixImport = NixImport;
