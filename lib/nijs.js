/**
 * @static @class nijs
 * Contains functions that convert a CommonJS module declaring packages into Nix
 * expressions and a way to execute them.
 */

var child_process = require('child_process');
var path = require('path');

var NixObject = require('./ast/NixObject.js').NixObject;
var NixValue = require('./ast/NixValue.js').NixValue;
var NixFile = require('./ast/NixFile.js').NixFile;
var NixURL = require('./ast/NixURL.js').NixURL;
var NixRecursiveAttrSet = require('./ast/NixRecursiveAttrSet.js').NixRecursiveAttrSet;
var NixLet = require('./ast/NixLet.js').NixLet;
var NixExpression = require('./ast/NixExpression.js').NixExpression;
var NixFunction = require('./ast/NixFunction.js').NixFunction;
var NixFunInvocation = require('./ast/NixFunInvocation.js').NixFunInvocation;
var NixWith = require('./ast/NixWith.js').NixWith;
var NixInlineJS = require('./ast/NixInlineJS.js').NixInlineJS;
var NixStorePath = require('./ast/NixStorePath.js').NixStorePath;

exports.NixObject = NixObject;
exports.NixValue = NixValue;
exports.NixFile = NixFile;
exports.NixURL = NixURL;
exports.NixRecursiveAttrSet = NixRecursiveAttrSet;
exports.NixLet = NixLet;
exports.NixExpression = NixExpression;
exports.NixFunction = NixFunction;
exports.NixFunInvocation = NixFunInvocation;
exports.NixWith = NixWith;
exports.NixInlineJS = NixInlineJS;
exports.NixStorePath = NixStorePath;

/**
 * @member nijs
 *
 * Converts members of an object to members of an attribute set
 *
 * @param {Object} obj Object to convert
 * @return {String} A string containing the Nix attribute set members
 */
function objectMembersToAttrsMembers(obj) {
    var str = "";
    
    for(var attrName in obj) {
        var attrValue = jsToNix(obj[attrName]);
        
        /* If a JavaScript member name contains weird characters, then we must use strings as attribute keys, instead of identifiers */
        var matchedIdentifier = attrName.match(/[a-zA-Z\_][a-zA-Z0-9\_\'\-]*/);
        
        var attrKey;
        
        if(matchedIdentifier == attrName)
            attrKey = attrName;
        else
            attrKey = '"' + attrName.replace(/\"/g, '\\"') + '"';
            
        /* Create the converted Nix expression */
        str += "  " + attrKey + " = " + attrValue + ";\n";
    }
    
    return str;
}

exports.objectMembersToAttrsMembers = objectMembersToAttrsMembers;

/**
 * @member nijs
 *
 * Converts a collection of JavaScript objects to a sementically equivalent or
 * similar Nix expression language object.
 *
 * @member nijs
 * @param {Mixed...} var_args A variable amount of parameters that can be of any JavaScript object type
 * @return {String} A string containing the converted Nix expression language object
 */
function jsToNix() {
    var expr = "";
    
    for(var i = 0; i < arguments.length; i++) {
    
        var arg = arguments[i];
        
        if(i > 0)
            expr += " "; /* Add white space between every argument */
        
        if(arg === null) {
            expr += "null"; /* We must check for the null reference explicitly */
        } else {
        
            /* Use a type match to determine the conversion from a JavaScript object to a Nix expression language object */
            var type = typeof arg;
    
            switch(type) {
                case "boolean":
                    if(arg)
                        expr += "true";
                    else
                        expr += "false";
                    
                    break;

                case "number":
                    expr += arg;
                    break;
        
                case "string":
                    expr = '"'+arg.replace(/\\/g, '\\\\').replace(/\"/g, '\\"')+'"';
                    break;
        
                case "object":
                    if(Array.isArray(arg)) { /* Arrays are also objects, but this will tell us the difference */
                        expr += "[\n";
                
                        for(var i = 0; i < arg.length; i++)
                            expr += "("+jsToNix(arg[i]) + ")\n";
                
                        expr += "]";
                    
                    } else if(arg instanceof NixObject) {
                        
                        /* NixObject instances represent Nix expression language constructs that have no JavaScript equivalent */
                        expr += arg.toNixExpr();
                        
                    } else {
                        /* Consider the argument an "ordinary" JavaScript object */
                        expr += "{\n" + objectMembersToAttrsMembers(arg) + "\n}";
                    }
                    break;
        
                case "function":
                    for(var i = 0; i < arg.length; i++)
                        expr += "arg" + i + ":\n";
            
                    expr += "nijsFunProxy {\n";
                    expr += "  function = ''"+arg.toString()+"'';\n";
                    expr += "  args = [\n";
                
                    for(var i = 0; i < arg.length; i++)
                        expr += "    arg" + i + "\n";
                
                    expr += "  ];\n";
                    expr += "}\n";
                    break;
            
                case "xml":
                    expr += '"'+arg.toXMLString().replace(/\"/g, '\\"')+'"';
                    break;
        
                case "undefined":
                    expr += "\"undefined\"";
                    break;
            }
        }
    }
    
    return expr;
}

exports.jsToNix = jsToNix;

/**
 * @member nijs
 *
 * Invokes the nix-build process to evaluate a given nix object containing a Nix
 * expression. As a side-effect, the declared package gets build.
 *
 * @param {Object} args Nix build parameters
 * @param {String} args.expression A string containing a Nix expression
 * @param {Array.<string>} args.params An array of strings representing command-line parameters passed to nix-build
 * @param {function(number, string)} args.callback Callback function that gets called with the non-zero exit status if the build fails, or the resulting Nix store path if it succeeds
 */
function nixBuild(args) {
    var output = "";
    
    /* Spawn nix-build process */
    var nixBuildProcess = child_process.spawn("nix-build", args.params.concat(["-"]));
    
    nixBuildProcess.stdin.write(args.expression);
    nixBuildProcess.stdin.end();

    nixBuildProcess.stdout.on("data", function(data) {
        output += data; /* Capture the Nix store path */
    });
    
    nixBuildProcess.stderr.on("data", function(data) {
        process.stderr.write(data);
    });
    
    nixBuildProcess.on("exit", function(code) {
        if(code == 0)
            args.callback(null, output.substring(0, output.length - 1));
        else
            args.callback("nix-build exited with status: "+code);
    });
};

exports.nixBuild = nixBuild;

/**
 * @member nijs
 *
 * Augments a given Nix object with a Nix expression with a Nixpkgs and NiJS
 * reference and executes nix-build to evaluate the expression.
 *
 * @param {Object} args Nix build parameters
 * @param {string} args.nixExpression A string that contains a Nix expression
 * @param {Array.<string>} args.params An array of strings representing command-line parameters passed to nix-build
 * @param {string} args.pkgsExpression An optional string containing a Nix expression importing the Nix packages collection. Defaults to the system's nixpkgs setting.
 * @param {function(number, string)} args.callback Callback function that gets called with the non-zero exit status if the build fails, or the resulting Nix store path if it succeeds
 */
function callNixBuild(args) {
    var pkgsExpression;
    
    if(args.pkgsExpression === undefined)
        pkgsExpression = "import <nixpkgs> {}";
    else
        pkgsExpression = args.pkgsExpression;
    
    /*
     * Hacky way to determine whether nijs is deployed by Nix or NPM.
     * If deployed by the latter, we need to somehow get it in the Nix store
     * when invoking JavaScript functions or inline JavaScript
     */
    
    var modulePathComponents = module.filename.split(path.sep);
    var nijsPath;
    
    if(modulePathComponents.length >= 8) {
        var rootPathComponent = modulePathComponents[modulePathComponents.length - 6];
        
        if(rootPathComponent.substring(32, 33) == "-") // This looks very much like a Nix store path
            nijsPath = "builtins.storePath " + path.resolve(path.join(path.dirname(module.filename), "..", "..", "..", ".."));
        else
            nijsPath = "builtins.getAttr (builtins.currentSystem) ((import " + path.resolve(path.join(path.dirname(module.filename), "..", "release.nix")) + " {}).build)";
    }
    
    /* Generate a Nix expression and evaluate it */
    var expression = "let\n"+
      "  pkgs = " + pkgsExpression + ";\n"+
      "  nijs = "+ nijsPath + ";\n"+
      '  nijsFunProxy = import "${nijs}/lib/node_modules/nijs/lib/funProxy.nix" { inherit (pkgs) stdenv nodejs; inherit nijs; };\n'+
      '  nijsInlineProxy = import "${nijs}/lib/node_modules/nijs/lib/inlineProxy.nix" { inherit (pkgs) stdenv writeTextFile nodejs; inherit nijs; };\n'+
      "in\n" +
      args.nixExpression;
      
    exports.nixBuild({
        expression : expression,
        params : args.params,
        callback : args.callback
    });
}

exports.callNixBuild = callNixBuild;
