var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
  return new nijs.NixLet({
      generateNumbers : new nijs.NixFunction(["min", "max"], new nijs.NixExpression("if min == max then [ min ] else [ min ] ++ (generateNumbers { min = builtins.add min 1; inherit max; })"))
    }, args.stdenv().mkDerivation({
      name : "numbers",
      numbers : new nijs.NixFunInvocation(new nijs.NixExpression("generateNumbers"), { min: 1, max: 10 }),
      buildCommand : "echo $numbers > $out"
    }));
};
