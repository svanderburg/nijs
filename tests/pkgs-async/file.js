var nijs = require('nijs');
var slasp = require('slasp');

exports.pkg = function(args, callback) {
  var src;
  
  slasp.sequence([
    function(callback) {
      args.fetchurl()({
        url : new nijs.NixURL("ftp://ftp.astron.com/pub/file/file-5.11.tar.gz"),
        sha256 : "c70ae29a28c0585f541d5916fc3248c3e91baa481f63d7ccec53d1534cbcc9b7"
      }, callback);
    },
    
    function(callback, _src) {
      src = _src;
      args.zlib(callback);
    },
    
    function(callback, zlib) {
      args.stdenv().mkDerivation ({
        name : "file-5.11",
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
