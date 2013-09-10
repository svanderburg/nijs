var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "addressPerson",
    message : new nijs.NixFunInvocation(
      new nijs.NixFunction({
          "firstName": undefined,
          "lastName": undefined,
          "prefix": "Dear"
        },
        "${prefix} ${firstName} ${lastName}"),
      {
        "firstName": "Sander",
        "lastName": "van der Burg"
      }),
    buildCommand : "echo $message > $out"
  });
};
