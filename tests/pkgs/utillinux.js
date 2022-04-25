var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "util-linux-2.37.4",
    src : args.fetchurl()({
      url : new nijs.NixURL("https://mirrors.edge.kernel.org/pub/linux/utils/util-linux/v2.37/util-linux-2.37.4.tar.xz"),
      sha256 : "10svcnsqmrsd660bzcm7k6dm8sa7hkknhr3bag1nccwimlb6jkk3"
    }),

    configureFlags : [
      "--without-ncurses",
      "--disable-use-tty-group",
      "--enable-fs-paths-default=/var/setuid-wrappers:/var/run/current-system/sw/sbin:/sbin",
      "--disable-makeinstall-setuid",
      "--disable-makeinstall-chown"
    ],

    buildInputs : [
      args.zlib()
    ],

    meta : {
      description : "A set of system utilities for Linux."
    }
  });
};
