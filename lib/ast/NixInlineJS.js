/**
 * @class NixInlineJS
 * @extends NixFunInvocation
 *
 * Creates embedded shell code in a string performing a Node.js invocation to
 * execute an inline JavaScript code fragment.
 */

var inherit = require('./util/inherit.js').inherit;
var NixFunInvocation = require('./NixFunInvocation.js').NixFunInvocation;
var nijs = require('../nijs.js');

/**
 * @constructor
 * Creates a new NixInlineJS instance.
 *
 * @param {Object} args Arguments to the function
 * @param {Function} args.code A JavaScript function containing code that must be executed
 * @param {Array.<Object>} args.requires An array of objects representing var-module pairs used to include CommonJS modules.
 *   var contains the identifier of the variable, the module the path to the CommonJS module
 * @param {Array.<Object>} args.module An array of Nix expressions containing Node.js packages that this function must utilise.
 */
function NixInlineJS(args) {
    
    /* Compose the NixInlineJS function's parameters */
    var params = {};
    
    if(typeof args.code == "function") {
        params.codeIsFunction = true;
        params.code = args.code.toString();
    } else {
        params.codeIsFunction = false;
        params.code = args.code;
    }
    
    if(args.requires === undefined)
        params.requires = [];
    else
        params.requires = args.requires;
    
    if(args.modules === undefined)
        params.modules = [];
    else
        params.modules = args.modules;
    
    /* Construct function invocation object to the nijsInlineProxy */
    NixFunInvocation.call(this, {
        funExpr: new nijs.NixExpression("nijsInlineProxy"),
        paramExpr: params
    });
}

/* NixInlineJS inherits from NixFunInvocation */
inherit(NixFunInvocation, NixInlineJS);

exports.NixInlineJS = NixInlineJS;
