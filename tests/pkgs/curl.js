var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "curl-7.29.0",
    src : args.fetchurl({
      url : new nijs.NixURL("http://curl.haxx.se/download/curl-7.29.0.tar.bz2"),
      sha256 : "0bw3sclhjqb2zwgcp6njjpaca62rwlj2mrw2r9wic47sqsxfhy4x"
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
