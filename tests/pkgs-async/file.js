var nijs = require('nijs');
var slasp = require('slasp');

exports.pkg = function(args, callback) {
  var src;

  slasp.sequence([
    function(callback) {
      args.fetchurl()({
        url : new nijs.NixURL("ftp://ftp.astron.com/pub/file/file-5.41.tar.gz"),
        sha256 : "0gv027jgdr0hdkw7m9ck0nwhq583f4aa7vnz4dzdbxv4ng3k5r8k"
      }, callback);
    },

    function(callback, _src) {
      src = _src;
      args.zlib(callback);
    },

    function(callback, zlib) {
      args.stdenv().mkDerivation ({
        name : "file-5.41",
        src : src,
        buildInputs : [ zlib ],

        meta : {
          description : "A program that shows the type of files",
          homepage : new nijs.NixURL("http://darwinsys.com/file")
        }
      }, callback);
    }
  ], callback);
};
