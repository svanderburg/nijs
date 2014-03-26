var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "util-linux-2.24",
    src : args.fetchurl()({
      url : new nijs.NixURL("http://www.kernel.org/pub/linux/utils/util-linux/v2.24/util-linux-2.24.tar.bz2"),
      sha256 : "1nfnymj03rdcxjb677a9qq1zirppr8csh32cb85qm23x5xndi6v3"
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
