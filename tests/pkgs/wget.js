var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "wget-1.20.3",

    src : args.fetchurl()({
      url : new nijs.NixURL("mirror://gnu/wget/wget-1.20.3.tar.gz"),
      sha256 : "0bh9ll078rxqnbx1r142p5h00drarzggc1isiqfdna05cg3czk1i"
    }),

    configureFlags : "--with-ssl=openssl --with-openssl=yes",
    openssl: args.openssl(),
    OPENSSL_CFLAGS : "-I$openssl/include" ,
    OPENSSL_LIBS : "-L$openssl/lib -lssl",

    buildInputs : [ args.openssl() ],

    meta : {
      description : "GNU Wget, a tool for retrieving files using HTTP, HTTPS, and FTP",
      license : "GPLv3+",
      homepage : new nijs.NixURL("http://www.gnu.org/software/wget")
    }
  });
};
