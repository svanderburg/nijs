var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
    return { _type : "nix", value : "pkgs.writeTextFile "+nijs.jsToNix(args) };
};
