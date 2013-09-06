{ nixpkgs ? <nixpkgs>
, system ? builtins.currentSystem
}:

let
  pkgs = import nixpkgs { inherit system; };
  
  version = builtins.readFile ./version;
  
  nijsImportPackage = import ./lib/importPackage.nix {
    inherit nixpkgs system;
  };
  
  determineTarballPath = tarball: {
    name = "nijs-tarball";
    outPath = "${tarball}/tarballs/nijs-${version}.tgz";
  };

  jobs = {
    tarball = {officialRelease ? false}:
  
      pkgs.releaseTools.sourceTarball {
        name = "nijs-tarball";
        inherit version;
        src = ./.;
        inherit officialRelease;
        distPhase = ''
          mkdir -p package
          cd package
          cp -av $src/* .
          cd ..
          tar cfvz nijs-${version}.tgz package
          mkdir -pv $out/tarballs
          cp *.tgz $out/tarballs
        '';
      };
  
    build = {tarball ? jobs.tarball {} }:

      pkgs.nodePackages.buildNodePackage {
        name = "nijs-${version}";
        src = determineTarballPath tarball;
  
        deps = [
          pkgs.nodePackages.optparse
        ];
      };
  
    doc = {tarball ? jobs.tarball {} }:
    
      pkgs.stdenv.mkDerivation {
        name = "nijs-docs-${version}";
        src = determineTarballPath tarball;
    
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
  };
in
jobs
