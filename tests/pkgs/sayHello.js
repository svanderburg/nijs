var nijs = require('../../lib/nijs.js');

var messageFun = new nijs.NixFunction("name", "Hello ${name}!");
var name = "Sander";

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "sayHello",
    message : new nijs.NixExpression(nijs.jsToNix(messageFun) + " " + nijs.jsToNix(name)),
    buildCommand : "echo $message > $out"
  });
};
