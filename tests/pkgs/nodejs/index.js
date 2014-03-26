var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation({
    name : "node-0.10.26",
    src : args.fetchurl()({
      url : new nijs.NixURL("http://nodejs.org/dist/v0.10.26/node-v0.10.26.tar.gz"),
      sha256 : "1ahx9cf2irp8injh826sk417wd528awi4l1mh7vxg7k8yak4wppg"
    }),
    
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
