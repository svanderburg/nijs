{nodeEnv, fetchurl, fetchgit}:

let
  sources = {
    "optparse-1.0.5" = {
      name = "optparse";
      packageName = "optparse";
      version = "1.0.5";
      src = fetchurl {
        url = "http://registry.npmjs.org/optparse/-/optparse-1.0.5.tgz";
        sha1 = "75e75a96506611eb1c65ba89018ff08a981e2c16";
      };
    };
    "slasp-0.0.4" = {
      name = "slasp";
      packageName = "slasp";
      version = "0.0.4";
      src = fetchurl {
        url = "http://registry.npmjs.org/slasp/-/slasp-0.0.4.tgz";
        sha1 = "9adc26ee729a0f95095851a5489f87a5258d57a9";
      };
    };
  };
  args = {
    name = "nijs";
    packageName = "nijs";
    version = "0.0.24";
    src = ./.;
    dependencies = [
      sources."optparse-1.0.5"
      sources."slasp-0.0.4"
    ];
    meta = {
      description = "An internal DSL for the Nix package manager in JavaScript";
      license = "MIT";
    };
    production = true;
  };
in
{
  tarball = nodeEnv.buildNodeSourceDist args;
  package = nodeEnv.buildNodePackage args;
  shell = nodeEnv.buildNodeShell args;
}