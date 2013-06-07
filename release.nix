{ nixpkgs ? <nixpkgs>
, system ? builtins.currentSystem
}:

let
  pkgs = import nixpkgs { inherit system; };
  
  version = builtins.readFile ./version;
in
rec {
  tarball = pkgs.stdenv.mkDerivation {
    name = "nijs-${version}.tgz";
    src = ./.;
    buildPhase = "true";
    installPhase = ''
      mkdir -p package
      cd package
      cp -av $src/* .
      cd ..
      tar cfvz $out package
    '';
  };

  build = pkgs.nodePackages.buildNodePackage {
    name = "nijs-${version}";
    src = tarball;
  
    deps = [
      pkgs.nodePackages.nijs
      pkgs.nodePackages.optparse
    ];
  };
  
  doc = pkgs.stdenv.mkDerivation {
    name = "nijs-docs-${version}";
    src = tarball;
    
    buildInputs = [ pkgs.rubyLibs.jsduck ];
    buildPhase = "make duck";
    installPhase = ''
      mkdir -p $out/nix-support
      cp -R build/* $out
      echo "doc api $out" >> $out/nix-support/hydra-build-products
    '';
  };
  
  tests = {
    proxytests = import ./tests/proxytests.nix {
      inherit pkgs;
    };
  };
}
