var path = require('path');
var child_process = require('child_process');
var nijs = require('./nijs.js');

/**
 * @member nijs
 *
 * Generates indentation to format the resulting output expression more nicely.
 *
 * @param {Number} indentLevel The indentation level of the resulting sub expression
 */
function generateIndentation(indentLevel) {
    var expr = "";
    
    for(var i = 0; i < indentLevel; i++) {
        expr += "  ";
    }
    
    return expr;
}

exports.generateIndentation = generateIndentation;

/**
 * @member nijs
 *
 * Converts members of an object to members of an attribute set
 *
 * @param {Object} obj Object to convert
 * @param {Number} indentLevel The indentation level of the resulting sub expression
 * @return {String} A string containing the Nix attribute set members
 */
function objectMembersToAttrsMembers(obj, indentLevel) {
    var str = "";
    
    for(var attrName in obj) {
        var attrValue = obj[attrName];
        
        if(attrValue !== undefined) { // Do not convert object members whose value is undefined, but instead skip them => this is analogous to JSON
            var indentation = generateIndentation(indentLevel);
        
            /* If a JavaScript member name contains weird characters, then we must use strings as attribute keys, instead of identifiers */
            var matchedIdentifier = attrName.match(/[a-zA-Z\_][a-zA-Z0-9\_\'\-]*/);
        
            var attrKey;
        
            if(matchedIdentifier == attrName)
                attrKey = attrName;
            else
                attrKey = '"' + attrName.replace(/\"/g, '\\"') + '"';
            
            /* Create the converted Nix expression */
            str += indentation + attrKey + " = " + jsToIndentedNix(attrValue, indentLevel) + ";\n";
        }
    }
    
    return str;
}

exports.objectMembersToAttrsMembers = objectMembersToAttrsMembers;

/**
 * @member nijs
 *
 * Converts a collection of JavaScript objects to a sementically equivalent or
 * similar Nix expression language object. It also uses indentation to format the
 * resulting sub expression more nicely.
 *
 * @param {Mixed...} var_args A variable amount of parameters that can be of any JavaScript object type.
 *   The last parameter is a numeric value must be provided to specify the indentation level of the resulting sub expression.
 * @return {String} A string containing the converted Nix expression language object
 */
function jsToIndentedNix() {
    var expr = "";
    var indentLevel = arguments[arguments.length - 1];
    
    for(var i = 0; i < arguments.length - 1; i++) {
    
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
                        
                        var indentation = generateIndentation(indentLevel);
                
                        for(var i = 0; i < arg.length; i++) {
                            var listMemberExpr = jsToIndentedNix(arg[i], indentLevel + 1);
                            
                            /* Function definitions and function invocations elements in a list require ( ) wrapped around them to make them work */
                            if((arg[i] instanceof nijs.NixFunction) || (arg[i] instanceof nijs.NixFunInvocation)) {
                                listMemberExpr = "(" + listMemberExpr + ")";
                            }
                            
                            expr += indentation + "  " + listMemberExpr + "\n";
                        }
                
                        expr += indentation + "]";
                    
                    } else if(arg instanceof nijs.NixObject) {
                        
                        /* NixObject instances represent Nix expression language constructs that have no JavaScript equivalent */
                        expr += arg.toNixExpr(indentLevel);
                        
                    } else {
                        /* Consider the argument an "ordinary" JavaScript object */
                        
                        var indentation = generateIndentation(indentLevel);
                        
                        expr += "{\n";
                        expr += objectMembersToAttrsMembers(arg, indentLevel + 1);
                        expr += indentation + "}";
                    }
                    break;
        
                case "function":
                    var indentation = generateIndentation(indentLevel + 1);
                
                    for(var i = 0; i < arg.length; i++)
                        expr += "arg" + i + ": ";
                    
                    expr += "\n" + indentation + "nijsFunProxy {\n";
                    expr += indentation + "  function = ''"+arg.toString()+"'';\n";
                    expr += indentation + "  args = [\n";
                
                    for(var i = 0; i < arg.length; i++)
                        expr += indentation + "    arg" + i + "\n";
                
                    expr += indentation + "  ];\n";
                    expr += indentation + "}";
                    break;
            
                case "xml":
                    expr += '"'+arg.toXMLString().replace(/\"/g, '\\"')+'"';
                    break;
        
                case "undefined":
                    expr += "null";
                    break;
            }
        }
    }
    
    return expr;
}

exports.jsToIndentedNix = jsToIndentedNix;

/**
 * @member nijs
 *
 * Converts a collection of JavaScript objects to a sementically equivalent or
 * similar Nix expression language object.
 *
 * @param {Mixed...} var_args A variable amount of parameters that can be of any JavaScript object type.
 * @return {String} A string containing the converted Nix expression language object
 */
function jsToNix() {
    var args = Array.prototype.slice.call(arguments, 0);
    args.push(0);
    
    return jsToIndentedNix.apply(this, args);
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
