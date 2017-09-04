var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "wget-1.19",
    
    src : args.fetchurl()({
      url : new nijs.NixURL("mirror://gnu/wget/wget-1.19.tar.gz"),
      sha256 : "1s5dvlsh4c870n1m7zx6xwliwsxg71d2v7syjj79xxj5k01j75fx"
    }),
    
    configureFlags : "--with-ssl=openssl",
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
