{ nixpkgs ? <nixpkgs>
, systems ? [ "i686-linux" "x86_64-linux" "x86_64-darwin" ]
, officialRelease ? false
}:

let
  pkgs = import nixpkgs {};
  
  version = builtins.readFile ./version;
  
  determineTarballPath = tarball: {
    name = "nijs-tarball";
    outPath = "${tarball}/tarballs/nijs-${version}.tgz";
  };

  jobs = rec {
    tarball = pkgs.releaseTools.sourceTarball {
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
  
    build = pkgs.lib.genAttrs systems (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      pkgs.nodePackages.buildNodePackage {
        name = "nijs-${version}";
        src = [ (determineTarballPath tarball) ];
  
        passthru.names = [ "nijs" ];
        deps = [
          pkgs.nodePackages.optparse
          pkgs.nodePackages.slasp
        ];
      });
  
    doc = pkgs.stdenv.mkDerivation {
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
        nijs = builtins.getAttr (builtins.currentSystem) (jobs.build);
      };
    
      pkgs = 
        let
          pkgsJsFile = "${./.}/tests/pkgs.js";
          
          nijsImportPackage = import ./lib/importPackage.nix {
            inherit nixpkgs;
            system = builtins.currentSystem;
            nijs = builtins.getAttr (builtins.currentSystem) (jobs.build);
          };
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
          sayHello = nijsImportPackage { inherit pkgsJsFile; attrName = "sayHello"; };
          addressPerson = nijsImportPackage { inherit pkgsJsFile; attrName = "addressPerson"; };
          addressPersons = nijsImportPackage { inherit pkgsJsFile; attrName = "addressPersons"; };
          numbers = nijsImportPackage { inherit pkgsJsFile; attrName = "numbers"; };
          sayHello2 = nijsImportPackage { inherit pkgsJsFile; attrName = "sayHello2"; };
          objToXML = nijsImportPackage { inherit pkgsJsFile; attrName = "objToXML"; };
          bzip2 = nijsImportPackage { inherit pkgsJsFile; attrName = "bzip2"; };
          utillinux = nijsImportPackage { inherit pkgsJsFile; attrName = "utillinux"; };
          python = nijsImportPackage { inherit pkgsJsFile; attrName = "python"; };
          nodejs = nijsImportPackage { inherit pkgsJsFile; attrName = "nodejs"; };
          optparse = nijsImportPackage { inherit pkgsJsFile; attrName = "optparse"; };
          slasp = nijsImportPackage { inherit pkgsJsFile; attrName = "slasp"; };
          nijs = nijsImportPackage { inherit pkgsJsFile; attrName = "nijs"; };
        };
    
      pkgsAsync =
        let
          pkgsJsFile = "${./.}/tests/pkgs-async.js";
          
          nijsImportPackageAsync = import ./lib/importPackageAsync.nix {
            inherit nixpkgs;
            system = builtins.currentSystem;
            nijs = builtins.getAttr (builtins.currentSystem) (jobs.build);
          };
        in
        {
          test = nijsImportPackageAsync { inherit pkgsJsFile; attrName = "test"; };
          hello = nijsImportPackageAsync { inherit pkgsJsFile; attrName = "hello"; };
          zlib = nijsImportPackageAsync { inherit pkgsJsFile; attrName = "zlib"; };
          file = nijsImportPackageAsync { inherit pkgsJsFile; attrName = "file"; };
          createFileWithMessageTest = nijsImportPackageAsync { inherit pkgsJsFile; attrName = "createFileWithMessageTest"; };
        };
    };
  };
in
jobs
