var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "sayHello",
    message : new nijs.NixFunInvocation({
      funExpr : new nijs.NixFunction({
        argSpec : "name",
        body : "Hello ${name}!"
      }),
      paramExpr : "Sander"
    }),
    buildCommand : "echo $message > $out"
  });
};
