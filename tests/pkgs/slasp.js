var nijs = require('nijs');

exports.pkg = function(args) {
  return args.buildNodePackage()({
    name : "slasp-0.0.3",
    src : args.fetchurl()({
      url : new nijs.NixURL("http://registry.npmjs.org/slasp/-/slasp-0.0.3.tgz"),
      sha1 : "fb9aba74f30fc2f012d0ff2d34d4b5c678c11f9f"
    }),
    
    meta : {
      description : "SugarLess Asynchronous Structured Programming"
    }
  });
};
