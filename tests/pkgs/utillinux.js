var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "util-linux-2.35",
    src : args.fetchurl()({
      url : new nijs.NixURL("https://mirrors.edge.kernel.org/pub/linux/utils/util-linux/v2.35/util-linux-2.35.1.tar.xz"),
      sha256 : "1yfpy6bkab4jw61mpx48gfy24yrqp4a7arvpis8csrkk53fkxpnr"
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
