var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "openssl-1.0.2l",
    
    src : args.fetchurl()({
      url : new nijs.NixURL("https://www.openssl.org/source/openssl-1.0.2l.tar.gz"),
      sha256 : "037kvpisc6qh5dkppcwbm5bg2q800xh2hma3vghz8xcycmdij1yf"
    }),
    
    buildInputs : [ args.perl() ],
    propagatedBuildInputs : [ args.zlib() ],
    
    configureScript : "./config",
    configureFlags : [ "shared", "--libdir=lib" ],
    makeFlags : "MANDIR=$(out)/share/man"
  });
};
