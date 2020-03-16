var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "node-12.16.1",
    src : args.fetchurl()({
      url : new nijs.NixURL("https://nodejs.org/download/release/latest-v12.x/node-v12.16.1.tar.xz"),
      sha256 : "0ba1dla31z6i31z3723l74nky1v04irwbl3iaqmi0iicl1dq958a"
    }),

    dontDisableStatic: true,
    preConfigure : 'sed -i -e "s|#!/usr/bin/env python|#! $(type -p python)|" configure',

    configureFlags : [ "--shared-openssl", "--shared-zlib" ],

    buildInputs : [
      args.python(),
      args.openssl(),
      args.zlib(),
      args.utillinux()
    ],

    setupHook : new nijs.NixFile({
      value : "setup-hook.sh",
      module : module
    }),

    meta : {
      homepage : new nijs.NixURL("http://nodejs.org"),
      description : "Platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications"
    }
  });
};
