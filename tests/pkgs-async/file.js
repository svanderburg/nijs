var nijs = require('nijs');
var slasp = require('slasp');

exports.pkg = function(args, callback) {
  var src;
  
  slasp.sequence([
    function(callback) {
      args.fetchurl()({
        url : new nijs.NixURL("ftp://ftp.astron.com/pub/file/file-5.32.tar.gz"),
        sha256 : "0l1bfa0icng9vdwya00ff48fhvjazi5610ylbhl35qi13d6xqfc6"
      }, callback);
    },
    
    function(callback, _src) {
      src = _src;
      args.zlib(callback);
    },
    
    function(callback, zlib) {
      args.stdenv().mkDerivation ({
        name : "file-5.32",
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
