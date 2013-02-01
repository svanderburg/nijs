exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "appendFiles",
        
    appendFileA : {
      _type : "file",
      value : "./appendFileA/text.txt",
      module : module
    },
        
    appendFileB : {
      _type : "file",
      value : "./append File B/text.txt",
      module : module
    },
        
    buildCommand : "cat $appendFileA $appendFileB > $out"
  });
};
