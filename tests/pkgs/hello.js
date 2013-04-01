var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "hello-2.8",
    
    src : args.fetchurl()({
      url : new nijs.NixURL("mirror://gnu/hello/hello-2.8.tar.gz"),
      sha256 : "0wqd8sjmxfskrflaxywc7gqw7sfawrfvdxd9skxawzfgyy0pzdz6"
    }),
  
    doCheck : true,

    meta : {
      description : "A program that produces a familiar, friendly greeting",
      homepage : new nijs.NixURL("http://www.gnu.org/software/hello/manual"),
      license : "GPLv3+"
    }
  });
};
