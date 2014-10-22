var nijs = require('nijs');

exports.pkg = function(args) {
  return args.buildNodePackage()({
    name : "slasp-0.0.4",
    src : args.fetchurl()({
      url : new nijs.NixURL("http://registry.npmjs.org/slasp/-/slasp-0.0.4.tgz"),
      sha1 : "9adc26ee729a0f95095851a5489f87a5258d57a9"
    }),
    
    meta : {
      description : "SugarLess Asynchronous Structured Programming"
    }
  });
};
