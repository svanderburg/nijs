var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "zlib-1.2.7",
    src : args.fetchurl()({
      url : new nijs.NixURL("mirror://sourceforge/libpng/zlib/1.2.7/zlib-1.2.7.tar.gz"),
      sha256 : "1i96gsdvxqb6skp9a58bacf1wxamwi9m9pg4yn7cpf7g7239r77s"
    }),
    configureFlags : "--shared"
  });
};

