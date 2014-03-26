var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "bzip2-1.0.6",
    src : args.fetchurl()({
      url : new nijs.NixURL("http://www.bzip.org/1.0.6/bzip2-1.0.6.tar.gz"),
      sha256 : "1kfrc7f0ja9fdn6j1y6yir6li818npy6217hvr3wzmnmzhs8z152"
    }),
    
    makeFlags : "PREFIX=$(out)",
    
    preBuild : "make -f Makefile-libbz2_so",
    
    preInstall : "mkdir -p $out/lib\n" +
        "mv libbz2.so* $out/lib\n" +
        "(cd $out/lib && ln -s libbz2.so.1.0.? libbz2.so && ln -s libbz2.so.1.0.? libbz2.so.1);",
    
    postInstall : "rm $out/bin/bunzip2* $out/bin/bzcat*\n" +
        "ln -s bzip2 $out/bin/bunzip2\n" +
        "ln -s bzip2 $out/bin/bzcat",
    
    meta : {
      homepage : new nijs.NixURL("http://www.bzip2.org"),
      description : "bzip2 is a freely available, patent free, high-quality data compressor."
    }
  });
};
