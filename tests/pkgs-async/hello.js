var nijs = require('nijs');
var slasp = require('slasp');

exports.pkg = function(args, callback) {
  slasp.sequence([
    function(callback) {
      args.fetchurl()({
        url : new nijs.NixURL("mirror://gnu/hello/hello-2.8.tar.gz"),
        sha256 : "0wqd8sjmxfskrflaxywc7gqw7sfawrfvdxd9skxawzfgyy0pzdz6"
      }, callback);
    },
    
    function(callback, src) {
      args.stdenv().mkDerivation ({
        name : "hello-2.8",
        src : src,
  
        doCheck : true,

        meta : {
          description : "A program that produces a familiar, friendly greeting",
          homepage : new nijs.NixURL("http://www.gnu.org/software/hello/manual"),
          license : "GPLv3+"
        }
      }, callback);
    }
  ], callback);
};
