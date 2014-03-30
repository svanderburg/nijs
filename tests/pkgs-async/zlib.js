var nijs = require('nijs');
var slasp = require('slasp');

exports.pkg = function(args, callback) {
  slasp.sequence([
    function(callback) {
      args.fetchurl()({
        url : new nijs.NixURL("mirror://sourceforge/libpng/zlib/1.2.7/zlib-1.2.7.tar.gz"),
        sha256 : "1i96gsdvxqb6skp9a58bacf1wxamwi9m9pg4yn7cpf7g7239r77s"
      }, callback);
    },
    
    function(callback, src) {
      args.stdenv().mkDerivation({
        name : "zlib-1.2.7",
        src : src,
        configureFlags : "--shared"
      }, callback);
    }
  ], callback);
};
