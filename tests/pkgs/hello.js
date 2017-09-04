var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "hello-2.10",
    
    src : args.fetchurl()({
      url : new nijs.NixURL("mirror://gnu/hello/hello-2.10.tar.gz"),
      sha256 : "0ssi1wpaf7plaswqqjwigppsg5fyh99vdlb9kzl7c9lng89ndq1i"
    }),
  
    doCheck : true,

    meta : {
      description : "A program that produces a familiar, friendly greeting",
      homepage : new nijs.NixURL("http://www.gnu.org/software/hello/manual"),
      license : "GPLv3+"
    }
  });
};
