/**
 * @class NixFile
 * @extends NixValue
 *
 * A Nix file object that gets imported into the Nix store. Paths to a file may
 * be absolute (starting with a /) or relative. For relative paths a module
 * reference must be given so that it can be correctly resolved to a correct
 * absolute path.
 */

var path = require('path');
var inherit = require('./inherit.js').inherit;
var NixValue = require('./NixValue.js').NixValue;

/**
 * @constructor
 * Creates a new NixFile instance.
 *
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
NixFile.prototype.toNixExpr = function() {
    var dir = "";
    
    /* 
     * If the path does not start with a / and a module is
     * defined, we consider the file to have a relative path
     * and we have to add the module's dirname as prefix
     */
    
    if(this.value.substring(0, 1) != '/' && this.module !== undefined)
        dir = path.dirname(this.module.filename) + "/";
    
    /* Generate Nix file object */
    if(dir.indexOf(" ") == -1 && this.value.indexOf(" ") == -1)
        return dir + this.value; /* Filenames without spaces can be placed verbatim */
    else
        return '/. + "' + dir.replace(/\"/g, '\\"') + this.value.replace(/\"/g, '\\"') + '"'; /* Filenames with spaces require some conversion */
};

exports.NixFile = NixFile;
