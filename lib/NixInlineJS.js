/**
 * @class NixInlineJS
 * @extends NixObject
 *
 * Creates embedded shell code in a string performing a Node.js invocation to
 * execute an inline JavaScript code fragment.
 */

var inherit = require('./inherit.js').inherit;
var NixObject = require('./NixObject.js').NixObject;
var nijs = require('./nijs.js');

/**
 * @constructor
 * Creates a new NixInlineJS instance.
 *
 * @param {Object} args Arguments to the function
 * @param {Function} args.code A JavaScript function containing code that must be executed
 * @param {Array.<Object>} args.requires An array of objects representing var-module pairs used to include CommonJS modules.
 *   var contains the identifier of the variable, the module the path to the CommonJS module
 * @param {Array.<NixExpression>} args.module An array of Nix expressions containing Node.JS packages that this function must utilise.
 */
function NixInlineJS(args) {
    this.code = args.code;
    
    if(args.requires === undefined)
        this.requires = [];
    else
        this.requires = args.requires;
    
    if(args.modules === undefined)
        this.modules = [];
    else
        this.modules = args.modules;
}

/* NixInlineJS inherits from NixObject */
inherit(NixObject, NixInlineJS);

/**
 * @see NixObject#toNixExpr
 */
NixInlineJS.prototype.toNixExpr = function() {
    var str = "nijsInlineProxy {\n";
    
    if(typeof arg.code == "function") {
        str += "  codeIsFunction = true;\n";
        str += "  code = ''"+arg.code.toString()+"'';\n";
    } else {
        str += "  codeIsFunction = false;\n";
        str += "  code = "+nijs.jsToNix(arg.code)+";\n";
    }
    
    str += "  requires = "+nijs.jsToNix(arg.requires)+";\n";
    str += "  modules = "+nijs.jsToNix(arg.modules)+";\n";
    str += "}\n";
    
    return str;
};

exports.NixInlineJS = NixInlineJS;
