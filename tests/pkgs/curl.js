var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "curl-7.55.1",
    src : args.fetchurl()({
      url : new nijs.NixURL("http://curl.haxx.se/download/curl-7.55.1.tar.bz2"),
      sha256 : "1yvcn7jbh99gsqhc040nky0h15a1cfh8yic6k0a1zhdhscpakcg5"
    }),
    
    propagatedBuildInputs : [
      args.zlib(),
      args.openssl()
    ],
    
    preConfigure : "sed -e 's|/usr/bin|/no-such-path|g' -i.bak configure",
    
    meta : {
      homepage : new nijs.NixURL("http://curl.haxx.se"),
      description : "A command line tool for transferring files with URL syntax"
    }
  });
};
