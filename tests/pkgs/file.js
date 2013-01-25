exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "file-5.11",
    
    src : args.fetchurl({
      url : "ftp://ftp.astron.com/pub/file/file-5.11.tar.gz",
      sha256 : "c70ae29a28c0585f541d5916fc3248c3e91baa481f63d7ccec53d1534cbcc9b7"
    }),
    
    buildInputs : [ args.zlib() ],
    
    meta : {
      description : "A program that shows the type of files",
      homepage : { _type : "url", "value" : "http://darwinsys.com/file" }
    }
  });
};
