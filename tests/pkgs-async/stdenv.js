var nijs = require('nijs');

exports.pkg = {
  /*mkDerivation : function(args, callback) {
    nijs.evaluateDerivation(args, callback);
  }*/
  
  mkDerivation : function(args, callback) {
    callback(null, new nijs.NixExpression("pkgs.stdenv.mkDerivation "+nijs.jsToNix(args)));
  }
};
