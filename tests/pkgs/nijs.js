var nijs = require('nijs');

exports.pkg = function(args) {
  return args.buildNodePackage()({
    name : "nijs-0.0.23",
    src : new nijs.NixFile({
      value : "../..",
      module : module
    }),
    deps : [
      args.optparse(),
      args.slasp()
    ],
    
    meta : {
      description : "An internal DSL for Nix in JavaScript"
    }
  });
};
