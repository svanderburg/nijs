var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "appendFiles",
        
    appendFileA : new nijs.NixFile ({
      value : "./appendFileA/text.txt",
      module : module
    }),
        
    appendFileB : new nijs.NixFile ({
      value : "./append File B/text.txt",
      module : module
    }),
        
    buildCommand : "cat $appendFileA $appendFileB > $out"
  });
};
