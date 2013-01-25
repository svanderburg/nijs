var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
    return { _type : "nix", value : "pkgs.fetchurl "+nijs.jsToNix(args) };
};
