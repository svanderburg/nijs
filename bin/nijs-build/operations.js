/**
 * @static @class nijs-build.operations
 * Contains NiJS build operations to be executed from the command-line interface.
 */
var path = require('path');
var slasp = require('slasp');
var nijs = require('../../lib/nijs.js');

/**
 * @member nijs-build.operations
 *
 * Imports the given package composition CommonJS module and evaluates the
 * specified package.
 *
 * @param {String} filename Path to the package composition CommonJS module
 * @param {String} attr Name of the package to evaluate
 * @return {String} A string containing the generated Nix expression
 */
function evaluatePackage(filename, attr) {
    var pkgs = require(path.resolve(filename)).pkgs;
    var pkg = pkgs[attr]();
    var expr = nijs.jsToNix(pkg);
    return expr;
}

/**
 * @member nijs-build.operations
 *
 * Imports the given package composition CommonJS module and asynchronously
 * evaluates the specified package.
 *
 * @param {String} filename Path to the package composition CommonJS module
 * @param {String} attr Name of the package to evaluate
 * @param {Function} callback Callback that gets invoked with either an error set if the operation failed, or a string containing the generated Nix expression
 */
function evaluatePackageAsync(filename, attr, callback) {
    var pkgs = require(path.resolve(filename)).pkgs;
    
    slasp.sequence([
        function(callback) {
            pkgs[attr](callback);
        },
        
        function(callback, pkg) {
            var expr = nijs.jsToNix(pkg);
            callback(null, expr);
        }
    ], callback);
}

/**
 * @member nijs-build.operations
 *
 * Evaluates the given package expression and redirects it to the standard output.
 *
 * @param {Object} args Arguments to this function
 * @param {String} args.filename Path to the package composition CommonJS module
 * @param {String} args.attr Name of the package to evaluate
 * @param {Boolean} args.async Indicates whether the deployment modules are defined asynchronously
 */
exports.evaluateModule = function(args) {
    if(args.async) {
        evaluatePackageAsync(args.filename, args.attr, function(err, expr) {
            process.stdout.write(expr + "\n");
        });
    } else {
        var expr = evaluatePackage(args.filename, args.attr);
        process.stdout.write(expr + "\n");
    }
};

/**
 * @member nijs-build.operations
 *
 * Evaluates the given package expression and invokes nix-build to build it.
 *
 * @param {Object} args Arguments to this function
 * @param {String} args.filename Path to the package composition CommonJS module
 * @param {String} args.attr Name of the package to evaluate
 * @param {String} args.showTrace Indicates whether an error trace must be shown
 * @param {String} args.keepFailed Specifies whether the build result must be kept in case of an error
 * @param {String} args.outLink Specifies the path to the resulting output symlink
 * @param {Boolean} args.noOutLink Disables the creation of the result symlink
 * @param {Boolean} args.async Indicates whether the deployment modules are defined asynchronously
 */
exports.nijsBuild = function(args) {
    /* Compose parameters to nix-build */
    var params = [];
    
    if(args.showTrace)
        params.push("--show-trace");
    
    if(args.keepFailed)
        params.push("-K");
    
    if(args.outLink !== null) {
        params.push("-o");
        params.push(args.outLink);
    }
    
    if(args.noOutLink)
        params.push("--no-out-link");
    
    /* Evaluate the package */

    slasp.sequence([
        function(callback) {
            if(args.async) {
                evaluatePackageAsync(args.filename, args.attr, callback);
            } else {
                var expr = evaluatePackage(args.filename, args.attr);
                callback(null, expr);
            }
        },
        
        function(callback, expr) {
            /* Call nix-build */
            nijs.callNixBuild({
                nixExpression : expr,
                params : params,
                callback : callback
            });
        }
        
    ], function(err, result) {
        if(err) {
            process.stderr.write(err + "\n");
            process.exit(1);
        } else {
            process.stdout.write(result + "\n");
        }
    });
};
