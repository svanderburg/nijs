var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "addressPersons",
    message : new nijs.NixFunInvocation(
      new nijs.NixFunction(
        ["persons", "prefix"],
        new nijs.NixExpression('map (person: "${prefix} ${person}\n") persons')
      ),
      {
        "persons": [ "Sander", "Eelco" ],
        "prefix": "Dear"
      }
    ),
    buildCommand : "echo $message > $out"
  });
};
