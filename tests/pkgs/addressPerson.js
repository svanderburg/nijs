var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "addressPerson",
    message : new nijs.NixFunInvocation({
      funExpr : new nijs.NixFunction({
        argSpec: {
          "firstName": undefined,
          "lastName": undefined,
          "prefix": "Dear"
        },
        body: "${prefix} ${firstName} ${lastName}"
      }),
      paramExpr : {
        "firstName": "Sander",
        "lastName": "van der Burg"
      }
    }),
    buildCommand : "echo $message > $out"
  });
};
