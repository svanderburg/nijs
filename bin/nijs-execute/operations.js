/**
 * @module nijs-execute.operations
 */

var path = require('path');
var nijs = require('../../lib/nijs.js');

/**
 * Directly executes the given asynchronous package expression module.
 *
 * @param {Object} args Arguments to this function
 * @param {String} args.filename Path to the package composition CommonJS module
 * @param {String} args.attr Name of the package to evaluate
 * @param {String} args.tmpdir Folder in which the temp files are stored
 * @param {String} args.output Folder in which the output files are stored
 */
exports.nijsExecute = function(args) {
    NIJS_EXECUTE = true; // Global variable that can be used by packages indicating that we use nijs-execute
    
    /* Set the tmpdir */
    if(args.tmpdir)
        NIJS_EXECUTE_TMPDIR = args.tmpdir;
    else if(process.env['TMPDIR'])
        NIJS_EXECUTE_TMPDIR = process.env['TMPDIR'];
    else
        NIJS_EXECUTE_TMPDIR = path.join(process.env['HOME'], ".nijs", "tmp");
    
    /* Set the output dir */
    
    if(args.output)
        NIJS_EXECUTE_OUTPUT = args.output;
    else if(process.env['NIJS_STORE'])
        NIJS_EXECUTE_OUTPUT = process.env['NIJS_STORE'];
    else
        NIJS_EXECUTE_OUTPUT = path.join(process.env['HOME'], ".nijs", "store");

    var pkgs = require(path.resolve(args.filename)).pkgs;
    var pkg = pkgs[args.attr];

    pkg(function(err, result) {
        if(err) {
            process.stderr.write(err.toString() + "\n");
            process.exit(1);
        } else {
            process.stdout.write(result + "\n");
        }
    });
};
