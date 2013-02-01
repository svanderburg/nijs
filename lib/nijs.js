var child_process = require('child_process');
var path = require('path');

exports.jsToNix = function() {
    var expr = "";
    
    for(var i = 0; i < arguments.length; i++) {
    
        var arg = arguments[i];
        
        if(i > 0)
            expr += " ";
        
        if(arg === null) {
            expr += "null";
        } else {
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
                    if(Array.isArray(arg)) {
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
 * args.nixObject
 * args.onSuccess
 * args.onFailure
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
 * args.nixObject
 * args.onSuccess
 * args.onFailure
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
