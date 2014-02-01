var nijs = require('nijs');

exports.pkg = function(args) {
  return new nijs.NixWith({
      withExpr: {
        firstName: "Sander",
        lastName: "van der Burg"
      },
      body: args.stdenv().mkDerivation({
        name : "sayHello2",
        buildCommand : "echo ${firstName} ${lastName} > $out"
      })
  });
};
