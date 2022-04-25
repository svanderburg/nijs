var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "hello-2.12",

    src : args.fetchurl()({
      url : new nijs.NixURL("mirror://gnu/hello/hello-2.12.tar.gz"),
      sha256 : "1ayhp9v4m4rdhjmnl2bq3cibrbqqkgjbl3s7yk2nhlh8vj3ay16g"
    }),

    doCheck : true,

    meta : {
      description : "A program that produces a familiar, friendly greeting",
      homepage : new nijs.NixURL("http://www.gnu.org/software/hello/manual"),
      license : "GPLv3+"
    }
  });
};
