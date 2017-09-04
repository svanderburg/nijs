var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "zlib-1.2.11",
    src : args.fetchurl()({
      url : new nijs.NixURL("mirror://sourceforge/libpng/zlib/1.2.11/zlib-1.2.11.tar.gz"),
      sha256 : "18dighcs333gsvajvvgqp8l4cx7h1x7yx9gd5xacnk80spyykrf3"
    }),
    configureFlags : "--shared"
  });
};
