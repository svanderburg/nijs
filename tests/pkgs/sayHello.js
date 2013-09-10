var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "sayHello",
    message : new nijs.NixFunInvocation(new nijs.NixFunction("name", "Hello ${name}!"), "Sander"),
    buildCommand : "echo $message > $out"
  });
};
