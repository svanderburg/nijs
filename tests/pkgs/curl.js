var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "curl-7.69.1",
    src : args.fetchurl()({
      url : new nijs.NixURL("http://curl.haxx.se/download/curl-7.69.1.tar.bz2"),
      sha256 : "1s2ddjjif1wkp69vx25nzxklhimgqzaazfzliyl6mpvsa2yybx9g"
    }),

    propagatedBuildInputs : [
      args.zlib(),
      args.openssl()
    ],

    preConfigure : "sed -e 's|/usr/bin|/no-such-path|g' -i.bak configure",

    meta : {
      homepage : new nijs.NixURL("http://curl.haxx.se"),
      description : "A command line tool for transferring files with URL syntax"
    }
  });
};
