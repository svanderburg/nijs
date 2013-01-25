exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "openssl-1.0.0i",
    
    src : args.fetchurl({
      url : { _type : "url", value : "http://www.openssl.org/source/openssl-1.0.0i.tar.gz" },
      sha1 : "b7aa11cbd7d264c2b1f44e3d55b334fb33f7b674"
    }),
    
    buildInputs : [ args.perl() ],
    propagatedBuildInputs : [ args.zlib() ],
    
    configureScript : "./config",
    configureFlags : [ "shared", "--libdir=lib" ],
    makeFlags : "MANDIR=$(out)/share/man",
  });
};
