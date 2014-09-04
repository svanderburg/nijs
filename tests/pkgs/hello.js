var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "hello-2.9",
    
    src : args.fetchurl()({
      url : new nijs.NixURL("mirror://gnu/hello/hello-2.9.tar.gz"),
      sha256 : "19qy37gkasc4csb1d3bdiz9snn8mir2p3aj0jgzmfv0r2hi7mfzc"
    }),
  
    doCheck : true,

    meta : {
      description : "A program that produces a familiar, friendly greeting",
      homepage : new nijs.NixURL("http://www.gnu.org/software/hello/manual"),
      license : "GPLv3+"
    }
  });
};
