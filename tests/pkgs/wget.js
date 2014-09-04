var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "wget-1.15",
    
    src : args.fetchurl()({
      url : new nijs.NixURL("mirror://gnu/wget/wget-1.15.tar.gz"),
      sha256 : "1kazd4hsqnvqfq7n6jwvm0mfvl6p782lrrw6d19xgp8vrzl6n4jj"
    }),
    
    configureFlags : "--with-ssl=openssl",
    
    buildInputs : [ args.openssl() ],
    
    meta : {
      description : "GNU Wget, a tool for retrieving files using HTTP, HTTPS, and FTP",
      license : "GPLv3+",
      homepage : new nijs.NixURL("http://www.gnu.org/software/wget")
    }
  });
};
