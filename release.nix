{ nixpkgs ? <nixpkgs>
, system ? builtins.currentSystem
}:

let
  pkgs = import nixpkgs { inherit system; };
  
  version = builtins.readFile ./version;
  
  nijsImportPackage = import ./lib/importPackage.nix {
    inherit nixpkgs system;
  };
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
    
    pkgs = 
      let
        pkgsJsFile = "${./.}/tests/pkgs.js";
      in
      {
        hello = nijsImportPackage { inherit pkgsJsFile; attrName = "hello"; };
        zlib = nijsImportPackage { inherit pkgsJsFile; attrName = "zlib"; };
        file = nijsImportPackage { inherit pkgsJsFile; attrName = "file"; };
        perl = nijsImportPackage { inherit pkgsJsFile; attrName = "perl"; };
        openssl = nijsImportPackage { inherit pkgsJsFile; attrName = "openssl"; };
        curl = nijsImportPackage { inherit pkgsJsFile; attrName = "curl"; };
        wget = nijsImportPackage { inherit pkgsJsFile; attrName = "wget"; };
        sumTest = nijsImportPackage { inherit pkgsJsFile; attrName = "sumTest"; };
        stringWriteTest = nijsImportPackage { inherit pkgsJsFile; attrName = "stringWriteTest"; };
        appendFilesTest = nijsImportPackage { inherit pkgsJsFile; attrName = "appendFilesTest"; };
        createFileWithMessageTest = nijsImportPackage { inherit pkgsJsFile; attrName = "createFileWithMessageTest"; };
      };
    };
}
