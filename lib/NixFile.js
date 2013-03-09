/**
 * @class NixFile
 * @extends NixObject
 *
 * A Nix file object that gets imported into the Nix store. Paths to a file may
 * be absolute (starting with a /) or relative. For relative paths a module
 * reference must be given so that it can be correctly resolved to a correct
 * absolute path.
 */

var inherit = require('./inherit.js').inherit;
var NixObject = require('./NixObject.js').NixObject;

/**
 * @constructor
 * Creates a new NixFile instance.
 *
 * @param {Object} args Arguments to this function
 * @param {String} args.value An absolute or relative path to a file
 * @param {Module} args.module Reference to the CommonJS module that refers to a relative path (not needed for absolute paths)
 */

function NixFile(args) {
    NixObject.call(this, args.value);
    this.module = args.module;
};

inherit(NixObject, NixFile);

exports.NixFile = NixFile;
