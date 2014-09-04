var nijs = require('nijs');

exports.pkg = {
  mkDerivation : function(args) {
    return new nijs.NixFunInvocation({
      funExpr: new nijs.NixExpression("pkgs.stdenv.mkDerivation"),
      paramExpr: args
    });
  }
};
