var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "node-0.10.31",
    src : args.fetchurl()({
      url : new nijs.NixURL("http://nodejs.org/dist/v0.10.31/node-v0.10.31.tar.gz"),
      sha256 : "1w919kihyjldmd7m6lmzpm22dbs6k9ib4innb7xzskb7i9qq3iq6"
    }),
    
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
