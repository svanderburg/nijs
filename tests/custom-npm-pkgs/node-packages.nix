{nodeEnv, fetchurl, fetchgit}:

let
  sources = {};
in
{
  underscore = nodeEnv.buildNodePackage {
    name = "underscore";
    packageName = "underscore";
    version = "1.8.3";
    src = fetchurl {
      url = "https://registry.npmjs.org/underscore/-/underscore-1.8.3.tgz";
      sha1 = "4f3fb53b106e6097fcf9cb4109f2a5e9bdfa5022";
    };
    meta = {
      description = "JavaScript's functional programming helper library.";
      homepage = http://underscorejs.org/;
      license = "MIT";
    };
    production = true;
  };
}