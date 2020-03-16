var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "file-5.38",

    src : args.fetchurl()({
      url : new nijs.NixURL("http://ftp.astron.com/pub/file/file-5.38.tar.gz"),
      sha256 : "0d7s376b4xqymnrsjxi3nsv3f5v89pzfspzml2pcajdk5by2yg2r"
    }),

    buildInputs : [ args.zlib() ],

    meta : {
      description : "A program that shows the type of files",
      homepage : new nijs.NixURL("http://darwinsys.com/file")
    }
  });
};
