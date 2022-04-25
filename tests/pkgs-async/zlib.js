var nijs = require('nijs');
var slasp = require('slasp');

exports.pkg = function(args, callback) {
  slasp.sequence([
    function(callback) {
      args.fetchurl()({
        url : new nijs.NixURL("http://www.zlib.net/fossils/zlib-1.2.12.tar.gz"),
        sha256 : "1n9na4fq4wagw1nzsfjr6wyly960jfa94460ncbf6p1fac44i14i"
      }, callback);
    },

    function(callback, src) {
      args.stdenv().mkDerivation({
        name : "zlib-1.2.12",
        src : src,
        configureFlags : "--shared"
      }, callback);
    }
  ], callback);
};
