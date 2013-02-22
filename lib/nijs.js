var child_process = require('child_process');
var path = require('path');

/**
 * Creates a Nix object that captures common properties for Nix language
 * constructs for which is no equivalent JavaScript type available.
 *
 * @constructor
 * @param {string} value Value of the reference
 */
function NixObject(value) {
    this.value = value;
};

exports.NixObject = NixObject;

/**
 * Creates a Nix file object that gets imported into the Nix store. Paths to a
 * file may be absolute (starting with a /) or relative. For relative paths a
 * module reference must be given so that it can be correctly resolved to a
 * correct absolute path.
 *
 * @constructor
 * @param {object} args Arguments to this function
 * @param {string} args.value An absolute of relative path to a file
 * @param {Module} args.module Reference to the CommonJS module that refers to a relative path (not needed for absolute paths)
 */
function NixFile(args) {
    NixObject.call(this, args.value);
    this.module = args.module;
};

exports.NixFile = NixFile;

/**
 * Creates a Nix URL object that gets validates by the Nix expression evaluator.
 *
 * @constructor
 * @param {string} value Value containing a URL
 */
function NixURL(value) {
    NixObject.call(this, value);
};

exports.NixURL = NixURL;

/**
 * Creates a Nix object that contains an already generated Nix expression.
 *
 * @constructor
 * @param {string} value Value containing a Nix expression
 */
function NixExpression(value) {
    NixObject.call(this, value);
};

exports.NixExpression = NixExpression;

/**
 * Creates a recursive attribute set in which members can refer to each other.
 *
 * @param {object} value An aribitrary object that should be represented as a recursive attribute set
 * @constructor
 */
function NixRecursiveAttrSet(value) {
    
    for(var attrName in value) {
        var attrValue = value[attrName];
        this[attrName] = attrValue;
    }
}

exports.NixRecursiveAttrSet = NixRecursiveAttrSet;

/**
 * Converts a collection of JavaScript objects to a sementically equivalent or
 * similar Nix expression language object.
 *
 * @param {...*} var_args A variable amount of parameters that can be of any JavaScript object type
 * @return {string} A string containing the converted Nix expression language object
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
                            str += "("+exports.jsToNix(arg[i]) + ")\n";
                
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
                        
                    } else {
                        var str = "";
                
                        if(arg instanceof NixRecursiveAttrSet)
                            str += "rec {\n";
                        else
                            str += "{\n";
            
                        for(var attrName in arg) {
                            var attrValue = exports.jsToNix(arg[attrName]);
                            str += "  "+attrName+" = "+attrValue+";\n";
                        }
            
                        str += "}";
            
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
 * Invokes the nix-build process to evaluate a given nix object containing a Nix
 * expression. As a side-effect, the declared package gets build.
 *
 * @param {object} args Nix build parameters
 * @param {NixExpression} args.nixObject An object instance of the NixExpression prototype, with a string value that contains a Nix expression
 * @param {Array.<string>} args.params An array of strings representing command-line parameters passed to nix-build
 * @param {function(string)} args.onSuccess Callback function that gets called with the resulting Nix store path, if the build succeeds
 * @param {function(number)} args.onFailure Callback function that gets called with the resulting non-zero exit status, if the build fails
 */
exports.nixBuild = function(args) {
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

/**
 * Augments a given Nix object with a Nix expression with a Nixpkgs and NiJS
 * reference and executes nix-build to evaluate the expression.
 *
 * @param {object} args Nix build parameters
 * @param {NixExpression} args.nixObject An object instance of the NixExpression prototype, with a string value that contains a Nix expression
 * @param {Array.<string>} args.params An array of strings representing command-line parameters passed to nix-build
 * @param {function(string)} args.onSuccess Callback function that gets called with the resulting Nix store path, if the build succeeds
 * @param {function(number)} args.onFailure Callback function that gets called with the resulting non-zero exit status, if the build fails
 */
exports.callNixBuild = function(args) {
    var expression = "let\n"+
      "  pkgs = import <nixpkgs> {};\n"+
      "  nijsFunProxy = import <nijs/lib/funProxy.nix> { inherit (pkgs) stdenv nodejs; };\n"+
      "in\n" + args.nixObject.value;
      
    exports.nixBuild({
        expression : expression,
        params : args.params,
        onSuccess : args.onSuccess,
        onFailure : args.onFailure
    });
}
