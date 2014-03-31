var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var slasp = require('slasp');
var nijs = require('../nijs.js');

/**
 * @member nijs
 *
 * Converts an object with function parameters to a representation that can be
 * used as environment variables in a builder environment.
 (
 * @param {Object} args An object representing the function arguments that must be converted
 * @param {Function} callback Callback that gets invoked if an error occured or if the work is done.
 */
function convertToShellArg(arg, callback) {
    slasp.when(function(callback) {
        callback(arg === null);
    }, function(callback) {
        callback(null, "");
    }, function() {
        slasp.circuit(function(callback) {
            callback(null, typeof arg);
        }, function(result) {
            switch(result) {
                case "boolean":
                    if(arg)
                        callback(null, "1");
                    else
                        callback(null, "");
                    break;
                
                case "string":
                case "number":
                case "xml":
                    callback(null, arg.toString());
                    break;
                
                case "object":
                    if(Array.isArray(arg)) {
                        var convertedArg = "";
                        var i;
                    
                        slasp.from(function(callback) {
                            i = 0;
                            callback(null);
                        }, function(callback) {
                            callback(null, i < arg.length);
                        }, function(callback) {
                            i++;
                            callback(null);
                        }, function(callback) {
                            slasp.sequence([
                                function(callback) {
                                    if(i > 0)
                                        convertedArg += " ";
                                
                                    convertToShellArg(arg[i], callback);
                                },
                            
                                function(callback, shellArg) {
                                    convertedArg += shellArg;
                                    callback(null);
                                }
                            ], callback);
                         }, function(err) {
                             if(err)
                                 callback(err);
                             else
                                 callback(null, convertedArg);
                         });
                    } else if(arg instanceof nijs.NixURL) {
                        callback(null, arg.value);
                    } else if(arg instanceof nijs.NixFile) {
                        
                        var filePath;
                        
                        slasp.sequence([
                            function(callback) {
                                
                                if(arg.module === undefined)
                                    filePath = arg.value;
                                else
                                    filePath = path.join(path.dirname(arg.module.filename), arg.value);
                                
                                fs.exists(filePath, function(exists) {
                                    callback(null, exists);
                                });
                            },
                            
                            function(_, exists) {
                                if(exists)
                                    callback(null, filePath);
                                else
                                    callback(filePath + " does not exists!");
                            }
                        ], callback);
                    
                    } else if(arg instanceof nijs.NixExpression) {
                    
                        nijs.callNixBuild({
                            nixExpression : arg,
                            params : [ "--no-out-link" ],
                            callback : callback
                        });
                
                    } else if(arg instanceof nijs.NixInlineJS) {
                        
                        var buildCommand = 'cat > $out << "___EOF___"\n' +
                            "(\n" +
                            "export NODE_PATH=" + path.resolve(path.join(path.dirname(module.filename), "..", "..")) + ":" + path.resolve(path.join(path.dirname(module.filename), "node_modules")) + "\n" +
                            "(\n"+
                            'cat << "__EOF__"\n' +
                            "var nijs = require('nijs');\n";
                        
                        for(var i = 0; i < arg.requires.length; i++) {
                            var require = arg.requires[i];
                            buildCommand += "var " + require['var'] + " = require('" + require.module + "');\n";
                        }
                        
                        if(typeof arg.code == "function")
                            buildCommand += "(" + arg.code.toString() + ")();\n";
                        else
                            buildCommand += arg.code.toString() + "\n";
                        
                        buildCommand += "__EOF__\n" +
                            ") | node\n" +
                            ")\n" +
                            "___EOF___\n" +
                            "chmod 755 $out\n";
                        
                        evaluateDerivation({
                            name: "inline-proxy" + (arg.name ? "-" + arg.name : ""),
                            buildCommand : buildCommand
                        }, callback);
                        
                    } else if(arg instanceof nijs.NixRecursiveAttrSet) {
                        evaluateDerivation(arg.value, callback);
                    } else {
                        evaluateDerivation(arg, callback);
                    }
                    break;
                
                case "undefined":
                    callback(null, "undefined");
                    break;
                
                default:
                    callback("Encountered an object of an unknown type");
            }
        }, callback);
    }, callback);
}

exports.convertToShellArg = convertToShellArg;

/**
 * @member nijs
 *
 * Directly executes derivations asynchronously.
 *
 * @param {Object} args Parameters to pass to the builder environment.
 * @param {Function} callback Callback that gets invoked if an error occured or if the work is done.
 */
function evaluateDerivation(args, callback) {
    
    var shellArgs = {};
    var builderTempDir;
    var out;
    
    slasp.sequence([
        function(callback) {
            /* Ignore meta attributes */
            delete args.meta;
            
            /* We must have a name */
            if(args.name === undefined)
               callback("The derivation must have a name!\n");
    
            /* Convert derivation arguments to shell arguments */
            slasp.fromEach(function(callback) { callback(null, args); }, function(argName, callback) {
                slasp.sequence([
                    function(callback) {
                        convertToShellArg(args[argName], callback);
                    },
                    
                    function(callback, shellArg) {
                        shellArgs[argName] = shellArg;
                        callback(null);
                    }
                ], callback);
            }, callback);
        },
        
        function(callback) {
            /* Generate output path */
            out = path.join(process.env['NIJS_STORE'], args.name);
    
            /* Generate tempdir */
    
            if(process.env['TMPDIR'] == "")
                tmpdir = "/tmp";
            else
                tmpdir = process.env['TMPDIR'];
    
            builderTempDir = path.join(tmpdir, args.name);
            fs.mkdir(builderTempDir, callback);
        },
        
        function() {
            /* Generate builder environment */
    
            var builderEnv = {
                "NIJS_STORE" : process.env['NIJS_STORE'],
                "NIJS_BUILD_TOP" : tmpdir,
                "TMPDIR" : tmpdir,
                "TEMPDIR" : tmpdir,
                "TMP" : tmpdir,
                "TEMP" : tmpdir,
                "PATH" : process.env['PATH'],
                "HOME" : "/homeless-shelter",
                "out" : out
            };
            
            /* Merge shellArgs into the builder environment */
            
            for(var name in shellArgs) {
                builderEnv[name] = shellArgs[name];
            }
    
            /* Execute builder process */
    
            var builder;
            
            if(builderEnv.builder)
                builder = builderEnv.builder;
            else
                builder = path.join(path.dirname(module.filename), "builder.sh");
            
            var builderProcess = child_process.spawn("/bin/sh", [ builder ], { cwd : builderTempDir, env : builderEnv });
    
            builderProcess.stderr.on("data", function(data) {
                process.stderr.write(data);
            });
    
            builderProcess.stdout.on("data", function(data) {
                process.stdout.write(data);
            });
    
            builderProcess.on("exit", function(code) {
                if(code == 0)
                    callback(null, path.join(process.env['NIJS_STORE'], args.name));
                else
                    callback("builder exited with status: " + code);
            });
        }
    ], callback);
}

exports.evaluateDerivation = evaluateDerivation;
