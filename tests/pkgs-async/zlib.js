var nijs = require('nijs');
var slasp = require('slasp');

exports.pkg = function(args, callback) {
  slasp.sequence([
    function(callback) {
      args.fetchurl()({
        url : new nijs.NixURL("mirror://sourceforge/libpng/zlib/1.2.11/zlib-1.2.11.tar.gz"),
        sha256 : "18dighcs333gsvajvvgqp8l4cx7h1x7yx9gd5xacnk80spyykrf3"
      }, callback);
    },
    
    function(callback, src) {
      args.stdenv().mkDerivation({
        name : "zlib-1.2.11",
        src : src,
        configureFlags : "--shared"
      }, callback);
    }
  ], callback);
};
