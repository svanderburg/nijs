var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "openssl-1.0.1i",
    
    src : args.fetchurl()({
      url : new nijs.NixURL("https://www.openssl.org/source/openssl-1.0.1i.tar.gz"),
      sha1 : "74eed314fa2c93006df8d26cd9fc630a101abd76"
    }),
    
    buildInputs : [ args.perl() ],
    propagatedBuildInputs : [ args.zlib() ],
    
    configureScript : "./config",
    configureFlags : [ "shared", "--libdir=lib" ],
    makeFlags : "MANDIR=$(out)/share/man",
  });
};
