var nijs = require('nijs');

exports.pkg = function(args) {
    return new nijs.NixFunInvocation({
      funExpr: new nijs.NixExpression("pkgs.writeTextFile"),
      paramExpr: args
    });
};
