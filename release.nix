{ nixpkgs ? <nixpkgs>
, systems ? [ "i686-linux" "x86_64-linux" "x86_64-darwin" ]
, officialRelease ? false
}:

let
  pkgs = import nixpkgs {};

  version = (builtins.fromJSON (builtins.readFile ./package.json)).version;

  jobset = import ./default.nix {
    inherit pkgs;
    system = builtins.currentSystem;
  };

  jobs = rec {
    inherit (jobset) tarball;

    package = pkgs.lib.genAttrs systems (system:
      (import ./default.nix {
        pkgs = import nixpkgs { inherit system; };
        inherit system;
      }).package.override {
        postInstall = ''
          mkdir -p $out/share/doc/nijs
          $out/lib/node_modules/nijs/node_modules/jsdoc/jsdoc.js -R README.md -r lib -d $out/share/doc/nijs/apidox
          mkdir -p $out/nix-support
          echo "doc api $out/share/doc/nijs/apidox" >> $out/nix-support/hydra-build-products
        '';
      }
    );

    tests = {
      proxytests = import ./tests/proxytests.nix {
        inherit pkgs;
        nijs = builtins.getAttr (builtins.currentSystem) (jobs.package);
      };

      pkgs =
        let
          pkgsJsFile = "${./.}/tests/pkgs.js";

          nijsImportPackage = import ./lib/importPackage.nix {
            inherit nixpkgs;
            system = builtins.currentSystem;
            nijs = builtins.getAttr (builtins.currentSystem) (jobs.package);
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
          addressPersonInformally = nijsImportPackage { inherit pkgsJsFile; attrName = "addressPersonInformally"; };
          numbers = nijsImportPackage { inherit pkgsJsFile; attrName = "numbers"; };
          sayHello2 = nijsImportPackage { inherit pkgsJsFile; attrName = "sayHello2"; };
          objToXML = nijsImportPackage { inherit pkgsJsFile; attrName = "objToXML"; };
          conditionals = nijsImportPackage { inherit pkgsJsFile; attrName = "conditionals"; };
          bzip2 = nijsImportPackage { inherit pkgsJsFile; attrName = "bzip2"; };
          utillinux = nijsImportPackage { inherit pkgsJsFile; attrName = "utillinux"; };
          python = nijsImportPackage { inherit pkgsJsFile; attrName = "python"; };
          nodejs = nijsImportPackage { inherit pkgsJsFile; attrName = "nodejs"; };
          optparse = nijsImportPackage { inherit pkgsJsFile; attrName = "optparse"; };
          slasp = nijsImportPackage { inherit pkgsJsFile; attrName = "slasp"; };
          nijs = nijsImportPackage { inherit pkgsJsFile; attrName = "nijs"; };
          underscoreTest = nijsImportPackage { inherit pkgsJsFile; attrName = "underscoreTest"; };
          HelloModel = nijsImportPackage { inherit pkgsJsFile; attrName = "HelloModel"; };
        };

      pkgsAsync =
        let
          pkgsJsFile = "${./.}/tests/pkgs-async.js";

          nijsImportPackageAsync = import ./lib/importPackageAsync.nix {
            inherit nixpkgs;
            system = builtins.currentSystem;
            nijs = builtins.getAttr (builtins.currentSystem) (jobs.package);
          };
        in
        {
          test = nijsImportPackageAsync { inherit pkgsJsFile; attrName = "test"; };
          hello = nijsImportPackageAsync { inherit pkgsJsFile; attrName = "hello"; };
          zlib = nijsImportPackageAsync { inherit pkgsJsFile; attrName = "zlib"; };
          file = nijsImportPackageAsync { inherit pkgsJsFile; attrName = "file"; };
          createFileWithMessageTest = nijsImportPackageAsync { inherit pkgsJsFile; attrName = "createFileWithMessageTest"; };
        };

      execute = import ./tests/execute.nix {
        nijs = builtins.getAttr (builtins.currentSystem) package;
        inherit nixpkgs pkgs tarball;
      };
    };

    release = pkgs.releaseTools.aggregate {
      name = "nijs-${version}";
      constituents = [
        tarball
      ]
      ++ map (system: builtins.getAttr system package) systems
      ++ map (name: builtins.getAttr name tests.proxytests) (builtins.attrNames tests.proxytests)
      ++ map (name: builtins.getAttr name tests.pkgs) (builtins.attrNames tests.pkgs)
      ++ map (name: builtins.getAttr name tests.pkgsAsync) (builtins.attrNames tests.pkgsAsync)
      ++ [ tests.execute ];

      meta.description = "Release-critical builds";
    };
  };
in
jobs
