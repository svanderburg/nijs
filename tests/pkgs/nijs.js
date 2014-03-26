var nijs = require('nijs');

exports.pkg = function(args) {
  return args.buildNodePackage()({
    name : "nijs-0.0.14",
    src : new nijs.NixFile({
      value : "../..",
      module : module
    }),
    deps : [
      args.optparse()
    ],
    
    meta : {
      description : "An internal DSL for Nix in JavaScript"
    }
  });
};
