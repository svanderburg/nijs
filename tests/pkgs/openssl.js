var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "openssl-1.0.2u",

    src : args.fetchurl()({
      url : new nijs.NixURL("https://www.openssl.org/source/old/1.0.2/openssl-1.0.2u.tar.gz"),
      sha256 : "05lxcs4hzyfqd5jn0d9p0fvqna62v2s4pc9qgmq0dpcknkzwdl7c"
    }),

    buildInputs : [ args.perl() ],
    propagatedBuildInputs : [ args.zlib() ],

    preConfigure : "sed -i 's|/usr/bin/env|$(type -p env)|g' ./config",
    configureScript : "./config",
    configureFlags : [ "shared", "--libdir=lib" ],
    makeFlags : "MANDIR=$(out)/share/man"
  });
};
