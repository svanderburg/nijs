var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "addressPersons",
    message : new nijs.NixFunInvocation({
      funExpr : new nijs.NixFunction({
        argSpec : ["persons", "prefix"],
        body : new nijs.NixExpression('map (person: "${prefix} ${person}\n") persons')
      }),
      paramExpr : {
        "persons": [ "Sander", "Eelco" ],
        "prefix": "Dear"
      }
    }),
    buildCommand : "echo $message > $out"
  });
};
