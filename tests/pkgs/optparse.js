var nijs = require('nijs');

exports.pkg = function(args) {
  return args.buildNodePackage()({
    name : "optparse-1.0.5",
    src : args.fetchurl()({
      url : new nijs.NixURL("http://registry.npmjs.org/optparse/-/optparse-1.0.5.tgz"),
      sha1 : "75e75a96506611eb1c65ba89018ff08a981e2c16"
    }),
    
    meta : {
      description : "Command-line option parser library for NodeJS programs"
    }
  });
};
