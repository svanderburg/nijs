var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "openssl-1.1.1n",

    src : args.fetchurl()({
      url : new nijs.NixURL("https://www.openssl.org/source/openssl-1.1.1n.tar.gz"),
      sha256 : "0ymif8rlc5cf5qp5bh2pxlrgq6xryh7g4sqfvrdjg9gnli8ypp20"
    }),

    buildInputs : [ args.perl() ],
    propagatedBuildInputs : [ args.zlib() ],

    preConfigure : "sed -i 's|/usr/bin/env|$(type -p env)|g' ./config",
    configureScript : "./config",
    configureFlags : [ "shared", "--libdir=lib" ],
    makeFlags : "MANDIR=$(out)/share/man"
  });
};
