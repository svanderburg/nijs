/**
 * @static @class nijs-execute.operations
 * Contains NiJS execute operations to be executed from the command-line interface.
 */

var path = require('path');
var nijs = require('../../lib/nijs.js');

/**
 * @member nijs-execute.operations
 *
 * Directly executes the given asynchronous package expression module.
 *
 * @param {Object} args Arguments to this function
 * @param {String} args.filename Path to the package composition CommonJS module
 * @param {String} args.attr Name of the package to evaluate
 */
exports.nijsExecute = function(args) {
    NIJS_EXECUTE = true; // Global variable that can be used by packages indicating that we use nijs-execute

    var pkgs = require(path.resolve(args.filename)).pkgs;
    var pkg = pkgs[args.attr];

    pkg(function(err, result) {
        if(err) {
            process.stderr.write(err.toString());
            process.exit(1);
        } else {
            process.stdout.write(result);
        }
    });
};
