var nijs = require('nijs');

exports.pkg = function(args) {
  return function(funArgs) {
    return args.stdenv().mkDerivation({
      name : funArgs.name,
      src : funArgs.src,
      deps : funArgs.deps,
      
      propagatedNativeBuildInputs : [
        args.nodejs()
      ],
      
      builder : new nijs.NixFile({
        value : "build-node-package.sh",
        module : module
      })

    });
  };
};
