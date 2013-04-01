var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "wget-1.14",
    
    src : args.fetchurl()({
      url : new nijs.NixURL("mirror://gnu/wget/wget-1.14.tar.gz"),
      sha256 : "0sf26vlklxx20fjnj30fx6rijpcyvdl6cjmh6m2bjnvn7a78k9pk"
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
