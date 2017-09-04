var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "util-linux-2.30",
    src : args.fetchurl()({
      url : new nijs.NixURL("https://www.kernel.org/pub/linux/utils/util-linux/v2.30/util-linux-2.30.tar.xz"),
      sha256 : "13d0ax8bcapga8phj2nclx86w57ddqxbr98ajibpzjq6d7zs8262"
    }),
    
    configureFlags : [
      "--without-ncurses",
      "--disable-use-tty-group",
      "--enable-fs-paths-default=/var/setuid-wrappers:/var/run/current-system/sw/sbin:/sbin"
    ],
    
    buildInputs : [
      args.zlib()
    ],
    
    meta : {
      description : "A set of system utilities for Linux."
    }
  });
};
