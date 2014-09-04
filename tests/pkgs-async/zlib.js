var nijs = require('nijs');
var slasp = require('slasp');

exports.pkg = function(args, callback) {
  slasp.sequence([
    function(callback) {
      args.fetchurl()({
        url : new nijs.NixURL("mirror://sourceforge/libpng/zlib/1.2.8/zlib-1.2.8.tar.gz"),
        sha256 : "039agw5rqvqny92cpkrfn243x2gd4xn13hs3xi6isk55d2vqqr9n"
      }, callback);
    },
    
    function(callback, src) {
      args.stdenv().mkDerivation({
        name : "zlib-1.2.8",
        src : src,
        configureFlags : "--shared"
      }, callback);
    }
  ], callback);
};
