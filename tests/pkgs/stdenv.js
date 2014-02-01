var nijs = require('nijs');

exports.pkg = {
  mkDerivation : function(args) {
    return new nijs.NixExpression("pkgs.stdenv.mkDerivation "+nijs.jsToNix(args));
  }
};
