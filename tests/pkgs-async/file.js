var nijs = require('nijs');
var slasp = require('slasp');

exports.pkg = function(args, callback) {
  var src;
  
  slasp.sequence([
    function(callback) {
      args.fetchurl()({
        url : new nijs.NixURL("ftp://ftp.astron.com/pub/file/file-5.19.tar.gz"),
        sha256 : "0z1sgrcfy6d285kj5izy1yypf371bjl3247plh9ppk0svaxv714l"
      }, callback);
    },
    
    function(callback, _src) {
      src = _src;
      args.zlib(callback);
    },
    
    function(callback, zlib) {
      args.stdenv().mkDerivation ({
        name : "file-5.19",
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
