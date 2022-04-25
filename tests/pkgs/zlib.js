var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "zlib-1.2.12",
    src : args.fetchurl()({
      url : new nijs.NixURL("https://www.zlib.net/fossils/zlib-1.2.12.tar.gz"),
      sha256 : "1n9na4fq4wagw1nzsfjr6wyly960jfa94460ncbf6p1fac44i14i"
    }),
    configureFlags : "--shared"
  });
};
