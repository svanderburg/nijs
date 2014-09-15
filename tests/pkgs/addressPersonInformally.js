var nijs = require('nijs');

exports.pkg = function(args) {
  return new nijs.NixLet({
    value: {
      person: {
        firstName: "Sander",
        lastName: "van der Burg"
      }
    },
    body: args.stdenv().mkDerivation({
      name: "addressPersonInformally",
      firstName: new nijs.NixAttrReference({
        attrSetExpr: new nijs.NixExpression("person"),
        refExpr: new nijs.NixExpression("firstName")
      }),
      buildCommand : "echo Hi $firstName > $out"
    })
  });
};
