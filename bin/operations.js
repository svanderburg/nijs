/**
 * @static @class operations
 * Contains NiJS operations to be executed from the command-line interface.
 */
var path = require('path');
var nijs = require('../lib/nijs.js');

/**
 * @member operations
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
 * @member operations
 *
 * Evaluates the given package expression and redirects it to the standard output.
 *
 * @param {Object} args Arguments to this function
 * @param {String} args.filename Path to the package composition CommonJS module
 * @param {String} args.attr Name of the package to evaluate
 */
exports.evaluateModule = function(args) {
    var expr = evaluatePackage(args.filename, args.attr);
    process.stdout.write(expr + "\n");
};

/**
 * @member operations
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
 */
exports.nijsBuild = function(args) {
    /* Evaluate the package */
    var expr = evaluatePackage(args.filename, args.attr);
    
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
    
    /* Call nix-build */
    nijs.callNixBuild({
        nixExpression : expr,
        params : params,
        callback : function(err, result) {
            if(err) {
                process.stdout.write(result + "\n");
            } else {
                process.stderr.write(err + "\n");
                process.exit(1);
            }
        }
    });
};
