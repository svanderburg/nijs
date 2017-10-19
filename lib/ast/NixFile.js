var path = require('path');
var inherit = require('./util/inherit.js').inherit;
var NixValue = require('./NixValue.js').NixValue;

/**
 * Creates a new NixFile instance.
 *
 * @class NixFile
 * @extends NixValue
 * @classdesc A Nix file object that gets imported into the Nix store. Paths to
 * a file may be absolute (starting with a /) or relative. For relative paths a
 * module reference must be given so that it can be correctly resolved to a
 * correct absolute path.
 *
 * @constructor
 * @param {Object} args Arguments to this function
 * @param {String} args.value An absolute or relative path to a file
 * @param {Module} args.module Reference to the CommonJS module that refers to a relative path (not needed for absolute paths)
 */

function NixFile(args) {
    NixValue.call(this, args.value);
    this.module = args.module;
};

/* NixFile inherits from NixValue */
inherit(NixValue, NixFile);

/**
 * @see NixObject#toNixExpr
 */
NixFile.prototype.toNixExpr = function(indentLevel, format) {

    var actualPath;

    /*
     * If the path does not start with a / and a module is
     * defined, we consider the file to have a relative path
     * and we have to add the module's dirname as prefix
     */
    if(this.value.substring(0, 1) != '/' && this.module !== undefined) {
        var dir = path.dirname(this.module.filename);
        actualPath = path.resolve(path.join(dir, this.value)) /* Compase a resolved path that does not contain any relative path components */
    } else {
        actualPath = this.value;
    }

    /* Generate Nix file object */
    if(actualPath.indexOf(" ") == -1)
        return actualPath; /* Filenames without spaces can be placed verbatim */
    else
        return '/. + "' + actualPath.replace(/\"/g, '\\"') + '"'; /* Filenames with spaces require some extra steps for conversion */
};

exports.NixFile = NixFile;
