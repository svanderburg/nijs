var nijs = require('nijs');

exports.pkg = {
  mkDerivation : function(args, callback) {
    if(typeof NIJS_EXECUTE != "undefined" && NIJS_EXECUTE)
      nijs.evaluateDerivation(args, callback);
    else
      callback(null, new nijs.NixFunInvocation({
        funExpr: new nijs.NixExpression("pkgs.stdenv.mkDerivation"),
        paramExpr: args
      }));
  }
};
