var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "node-12.22.12",
    src : args.fetchurl()({
      url : new nijs.NixURL("https://nodejs.org/download/release/latest-v12.x/node-v12.22.12.tar.xz"),
      sha256 : "1whl0zi6fs9ay33bhcn2kh9xynran05iipahg1zzr6sv97wbfhmw"
    }),

    dontDisableStatic: true,

    preConfigure: 'sed -i -e "s|#!/usr/bin/env python|#! $(type -p python)|" configure',
    postInstall: 'sed -i -e "s|#!/usr/bin/env node|#! $out/bin/node|" $out/lib/node_modules/npm/bin/npm-cli.js',

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
