var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "file-5.19",
    
    src : args.fetchurl()({
      url : new nijs.NixURL("ftp://ftp.astron.com/pub/file/file-5.19.tar.gz"),
      sha256 : "0z1sgrcfy6d285kj5izy1yypf371bjl3247plh9ppk0svaxv714l"
    }),
    
    buildInputs : [ args.zlib() ],
    
    meta : {
      description : "A program that shows the type of files",
      homepage : new nijs.NixURL("http://darwinsys.com/file")
    }
  });
};
