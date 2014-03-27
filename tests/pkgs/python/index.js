var nijs = require('nijs');

exports.pkg = function(args) {
  var inputs = [
    args.zlib(),
    args.bzip2(),
    args.openssl()
  ];

  return args.stdenv().mkDerivation({
    name : "python-2.7.5",
    src : args.fetchurl()({
      url : new nijs.NixURL("http://www.python.org/ftp/python/2.7.5/Python-2.7.5.tar.bz2"),
      sha256 : "0nc091f19sllibvxm6n3qw5pflcphkwwxmz43q26lqafhra7airv"
    }),
    
    patches : [
      new nijs.NixFile({
        value : "search-path.patch",
        module : module
      }),
      
      new nijs.NixFile({
        value : "nix-store-mtime.patch",
        module : module
      }),
      
      new nijs.NixFile({
        value : "deterministic-build.patch",
        module : module
      })
    ],
    
    buildInputs : inputs,
    inputs : inputs,
    
    builder : new nijs.NixFile({
      value : "builder.sh",
      module : module
    }),
    
    configureFlags : "--enable-shared",
    
    setupHook : new nijs.NixFile({
      value : "setup-hook.sh",
      module : module
    }),
    
    meta : {
      homepage : new nijs.NixURL("http://python.org"),
      description : "Python is a programming language that lets you work quickly and integrate systems more effectively."
    }
  });
};