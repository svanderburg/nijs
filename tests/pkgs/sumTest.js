var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation(new nijs.NixRecursiveAttrSet ({ // Allow attributes to refer to each other
    name : "sumtest",
    
    meta : { // Prevent builder to stringify the function
      sumFun : function(a, b) {
        return a + b;
      }
    },
    
    buildCommand : 'echo ${toString (meta.sumFun 1 2)} > $out'
  }));
};
