var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "zlib-1.2.8",
    src : args.fetchurl()({
      url : new nijs.NixURL("mirror://sourceforge/libpng/zlib/1.2.8/zlib-1.2.8.tar.gz"),
      sha256 : "039agw5rqvqny92cpkrfn243x2gd4xn13hs3xi6isk55d2vqqr9n"
    }),
    configureFlags : "--shared"
  });
};
