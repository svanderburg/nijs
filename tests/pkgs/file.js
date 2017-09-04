var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "file-5.32",
    
    src : args.fetchurl()({
      url : new nijs.NixURL("ftp://ftp.astron.com/pub/file/file-5.32.tar.gz"),
      sha256 : "0l1bfa0icng9vdwya00ff48fhvjazi5610ylbhl35qi13d6xqfc6"
    }),
    
    buildInputs : [ args.zlib() ],
    
    meta : {
      description : "A program that shows the type of files",
      homepage : new nijs.NixURL("http://darwinsys.com/file")
    }
  });
};
