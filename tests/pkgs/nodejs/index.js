var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "node-4.8.4",
    src : args.fetchurl()({
      url : new nijs.NixURL("https://nodejs.org/dist/v4.8.4/node-v4.8.4.tar.xz"),
      sha256 : "0nwh2m5f3rl7hiidhbpb9h7q3jaajvfdjqbi69wkrsfb90x67zim"
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
