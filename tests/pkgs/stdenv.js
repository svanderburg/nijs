var nijs = require('../../lib/nijs.js');

exports.pkg = {
  mkDerivation : function(args) {
    return { _type : "nix", value : "pkgs.stdenv.mkDerivation "+nijs.jsToNix(args) };
  }
};
