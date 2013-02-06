var child_process = require('child_process');
var path = require('path');

/**
 * Converts a collection of JavaScript objects to a sementically equivalent or
 * similar Nix expression language object.
 *
 * @param {...*} var_args A variable amount of parameters that can be of any JavaScript object type
 * @return {string} A string containing the converted Nix expression language object
 */
exports.jsToNix = function() {
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
                        
                    } else if(arg._type == "url") {
                        expr += arg.value;
                        break;
                    
                    } else if(arg._type == "file") {
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
                        
                    } else if(arg._type == "nix") {
                        expr += "(" + arg.value + ")";
                        break;
                        
                    } else {
                        var str = "";
                
                        if(arg._recursive)
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
};

/**
 * Invokes the nix-build process to evaluate a given nix object containing a Nix
 * expression. As a side-effect, the declared package gets build.
 *
 * @param {object} args Nix build parameters
 * @param {NixObject} args.nixObject An object of type nix, with a string value that contains a Nix expression
 * @param {function(string)} args.onSuccess Callback function that gets called with the resulting Nix store path, if the build succeeds
 * @param {function(number)} args.onFailure Callback function that gets called with the resulting non-zero exit status, if the build fails
 */
exports.nixBuild = function(args) {
    var output = "";
    
    var nixBuildProcess = child_process.spawn("nix-build", ["-"]);
    
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
 * @param {NixObject} args.nixObject An object of type nix, with a string value that contains a Nix expression
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
        onSuccess : args.onSuccess,
        onFailure : args.onFailure
    });
}
