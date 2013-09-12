var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
  return new nijs.NixLet({
    value: {
      generateNumbers : new nijs.NixFunction({
        argSpec : ["min", "max"],
        body : new nijs.NixExpression("if min == max then [ min ] else [ min ] ++ (generateNumbers { min = builtins.add min 1; inherit max; })")
      })
    },
    body: args.stdenv().mkDerivation({
      name : "numbers",
      numbers : new nijs.NixFunInvocation({
        funExpr : new nijs.NixExpression("generateNumbers"),
        paramExpr : { min: 1, max: 10 }
      }),
      buildCommand : "echo $numbers > $out"
    })
  });
};
