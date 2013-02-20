var path = require('path');
var nijs = require('../lib/nijs.js');

/**
 * Imports the given package composition CommonJS module and evaluates the
 * specified package.
 *
 * @param {string} filename Path to the package composition CommonJS module
 * @param {string} attr Name of the package to evaluate
 * @return {object} An object having a _type set to nix and a value that contains the generated Nix expression
 */
function evaluatePackage(filename, attr) {
    var pkgs = require(path.resolve(filename)).pkgs;
    var pkg = pkgs[attr]();
    return pkg;
}

/**
 * Evaluates the given package expression and redirects it to the standard output.
 *
 * @param {object} args Arguments to this function
 * @param {string} args.filename Path to the package composition CommonJS module
 * @param {string} args.attr Name of the package to evaluate
 */
exports.evaluateModule = function(args) {
    var pkg = evaluatePackage(args.filename, args.attr);
    process.stdout.write(pkg.value + "\n");
};

/**
 * Evaluates the given package expression and invokes nix-build to build it.
 *
 * @param {object} args Arguments to this function
 * @param {string} args.filename Path to the package composition CommonJS module
 * @param {string} args.attr Name of the package to evaluate
 * @param {string} args.showTrace Indicates whether an error trace must be shown
 * @param {string} args.keepFailed Specifies whether the build result must be kept in case of an error
 * @param {string} args.outLink Specifies the path to the resulting output symlink
 * @param {boolean} args.noOutLink Disables the creation of the result symlink
 */
exports.nixBuild = function(args) {
    /* Evaluate the package */
    var pkg = evaluatePackage(args.filename, args.attr);
    
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
        nixObject : pkg,
        params : params,
        onSuccess : function(result) {
            process.stdout.write(result + "\n");
        },
        onFailure : function(code) {
            process.exit(code);
        }
    });
};
