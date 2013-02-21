var nijs = require('../../lib/nijs.js');

exports.pkg = {
  mkDerivation : function(args) {
    return new nijs.NixExpression("pkgs.stdenv.mkDerivation "+nijs.jsToNix(args));
  }
};
