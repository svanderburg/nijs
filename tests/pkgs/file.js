var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "file-5.41",

    src : args.fetchurl()({
      url : new nijs.NixURL("http://ftp.astron.com/pub/file/file-5.41.tar.gz"),
      sha256 : "0gv027jgdr0hdkw7m9ck0nwhq583f4aa7vnz4dzdbxv4ng3k5r8k"
    }),

    buildInputs : [ args.zlib() ],

    meta : {
      description : "A program that shows the type of files",
      homepage : new nijs.NixURL("http://darwinsys.com/file")
    }
  });
};
