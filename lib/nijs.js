/**
 * @static @class nijs
 * Contains functions that convert a CommonJS module declaring packages into Nix
 * expressions and a way to execute them.
 */

var child_process = require('child_process');
var path = require('path');

var NixObject = require('./NixObject.js').NixObject;
var NixFile = require('./NixFile.js').NixFile;
var NixURL = require('./NixURL.js').NixURL;
var NixRecursiveAttrSet = require('./NixRecursiveAttrSet.js').NixRecursiveAttrSet;
var NixExpression = require('./NixExpression.js').NixExpression;
var NixInlineJS = require('./NixInlineJS.js').NixInlineJS;

exports.NixObject = NixObject;
exports.NixFile = NixFile;
exports.NixURL = NixURL;
exports.NixRecursiveAttrSet = NixRecursiveAttrSet;
exports.NixExpression = NixExpression;
exports.NixInlineJS = NixInlineJS;

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
            str += "  "+attrName+" = "+attrValue+";\n";
    }
    
    return str;
}

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
                    expr = '"'+arg.replace(/\"/g, '\\"')+'"';
                    break;
        
                case "object":
                    if(Array.isArray(arg)) { /* Arrays are also objects, but this will tell us the difference */
                        var str = "[\n";
                
                        for(var i = 0; i < arg.length; i++)
                            str += "("+jsToNix(arg[i]) + ")\n";
                
                        str += "]";
                
                        expr += str;
                        break;
                        
                    } else if(arg instanceof NixURL) {
                        expr += arg.value;
                        break;
                    
                    } else if(arg instanceof NixFile) {
                        var dir = "";
                        
                        /* 
                         * If the path does not start with a / and a module is
                         * defined, we consider the file to have a relative path
                         * and we have to add the module's dirname as prefix
                         */
                         
                        if(arg.value.substring(0, 1) != '/' && arg.module !== undefined)
                            dir = path.dirname(arg.module.filename) + "/";
                    
                        /* Generate Nix file object */
                        if(dir.indexOf(" ") == -1 && arg.value.indexOf(" ") == -1)
                            expr += dir + arg.value; /* Filenames without spaces can be placed verbatim */
                        else
                            expr += '/. + "' + dir.replace(/\"/g, '\\"') + arg.value.replace(/\"/g, '\\"') + '"'; /* Filenames with spaces require some conversion */
                            
                        break;
                        
                    } else if(arg instanceof NixExpression) {
                        expr += "(" + arg.value + ")";
                        break;
                    } else if(arg instanceof NixRecursiveAttrSet) {
                    
                        var str = "rec {\n" + objectMembersToAttrsMembers(arg.value) + "\n}";
                        expr += str;
                        break;
                        
                    } else if(arg instanceof NixInlineJS) {
                    
                        var str = "nijsInlineProxy {\n";
                        
                        if(typeof arg.code == "function") {
                            str += "  codeIsFunction = true;\n";
                            str += "  code = ''"+arg.code.toString()+"'';\n";
                        } else {
                            str += "  codeIsFunction = false;\n";
                            str += "  code = "+nixToJS(arg.code)+";\n";
                        }
                        
                        str += "  requires = "+jsToNix(arg.requires)+";\n";
                        str += "  modules = "+jsToNix(arg.modules)+";\n";
                        str += "}\n";
                        
                        expr += str;
                        break;
                    
                    } else {
                        var str = "{\n" + objectMembersToAttrsMembers(arg) + "\n}";
                        expr += str;
                        break;
                    }
        
                case "function":
                    var str = "";
                
                    for(var i = 0; i < arg.length; i++)
                        str += "arg" + i + ":\n";
            
                    str += "nijsFunProxy {\n";
                    str += "  function = ''"+arg.toString()+"'';\n";
                    str += "  args = [\n";
                
                    for(var i = 0; i < arg.length; i++)
                        str += "    arg" + i + "\n";
                
                    str += "  ];\n";
                    str += "}\n";
            
                    expr += str;
                    break;
            
                case "xml":
                    expr += '"'+arg.toXMLString().replace(/\"/g, '\\"')+'"';
                    break;
        
                case "undefined":
                    throw "We cannot convert something that is undefined!";
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
 * @param {function(string)} args.onSuccess Callback function that gets called with the resulting Nix store path, if the build succeeds
 * @param {function(number)} args.onFailure Callback function that gets called with the resulting non-zero exit status, if the build fails
 */
function nixBuild(args) {
    var output = "";
    
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
            args.onSuccess(output.substring(0, output.length - 1));
        else
            args.onFailure(code);
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
 * @param {NixExpression} args.nixExpression An object instance of the NixExpression prototype, with a string value that contains a Nix expression
 * @param {Array.<string>} args.params An array of strings representing command-line parameters passed to nix-build
 * @param {function(string)} args.onSuccess Callback function that gets called with the resulting Nix store path, if the build succeeds
 * @param {function(number)} args.onFailure Callback function that gets called with the resulting non-zero exit status, if the build fails
 */
function callNixBuild(args) {
    var expression = "let\n"+
      "  pkgs = import <nixpkgs> {};\n"+
      "  nijsFunProxy = import <nijs/funProxy.nix> { inherit (pkgs) stdenv nodejs; };\n"+
      "  nijsInlineProxy = import <nijs/inlineProxy.nix> { inherit (pkgs) stdenv writeTextFile nodejs; };\n"+
      "in\n" + args.nixExpression.value;
      
    exports.nixBuild({
        expression : expression,
        params : args.params,
        onSuccess : args.onSuccess,
        onFailure : args.onFailure
    });
}

exports.callNixBuild = callNixBuild;
