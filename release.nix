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

      execute =
        let
          nijs = builtins.getAttr (builtins.currentSystem) package;
          documentRoot = pkgs.stdenv.mkDerivation {
            name = "documentroot";

            srcHello = pkgs.fetchurl {
              url = mirror://gnu/hello/hello-2.12.tar.gz;
              sha256 = "1ayhp9v4m4rdhjmnl2bq3cibrbqqkgjbl3s7yk2nhlh8vj3ay16g";
            };

            srcZlib = pkgs.fetchurl {
              url = https://www.zlib.net/fossils/zlib-1.2.12.tar.gz;
              sha256 = "1n9na4fq4wagw1nzsfjr6wyly960jfa94460ncbf6p1fac44i14i";
            };

            srcFile = pkgs.fetchurl {
              url = ftp://ftp.astron.com/pub/file/file-5.41.tar.gz;
              sha256 = "0gv027jgdr0hdkw7m9ck0nwhq583f4aa7vnz4dzdbxv4ng3k5r8k";
            };

            buildCommand = ''
              mkdir -p $out/hello
              cp $srcHello $out/hello/hello-2.12.tar.gz
              mkdir -p $out/fossils
              cp $srcZlib $out/fossils/zlib-1.2.12.tar.gz
              mkdir -p $out/pub/file
              cp $srcFile $out/pub/file/file-5.41.tar.gz
            '';
          };
        in
        with import "${nixpkgs}/nixos/lib/testing-python.nix" { system = builtins.currentSystem; };

        simpleTest {
          nodes = {
            machine = {pkgs, ...}:

            {
              networking.extraHosts = ''
                127.0.0.2 ftpmirror.gnu.org www.zlib.net ftp.astron.com
              '';

              services.httpd.enable = true;
              services.httpd.adminAddr = "admin@localhost";
              services.httpd.virtualHosts.localhost.documentRoot = documentRoot;

              services.vsftpd.enable = true;
              services.vsftpd.anonymousUser = true;
              services.vsftpd.anonymousUserHome = "/home/ftp/";

              environment.systemPackages = [ nijs pkgs.stdenv pkgs.gcc pkgs.gnumake pkgs.binutils ];
            };
          };
          testScript =
            ''
              start_all()

              # Unpack the tarball to retrieve the testcases
              machine.succeed("tar xfvz ${tarball}/tarballs/*.tgz")

              # Build the 'test' package and check whether the output contains
              # 'Hello world'
              result = machine.succeed("cd package/tests && nijs-execute pkgs-async.js -A test")
              machine.succeed("[ \"\$(cat {} | grep 'Hello world')\" != \"\" ]".format(result[:-1]))

              # Build GNU Hello and see whether we can run it
              machine.wait_for_unit("httpd")
              result = machine.succeed("cd package/tests && nijs-execute pkgs-async.js -A hello >&2")
              machine.succeed("$HOME/.nijs/store/hello-*/bin/hello")

              # Build file and its dependencies (zlib) and see whether we can
              # run it
              machine.succeed("cp -r ${documentRoot}/pub /home/ftp")
              machine.wait_for_unit("vsftpd")
              machine.succeed("cd package/tests && nijs-execute pkgs-async.js -A file >&2")
              machine.succeed("$HOME/.nijs/store/file-*/bin/file --version")

              # Two of file's shared libraries (libmagic and libz) should refer to the NiJS store
              machine.succeed('[ "$(ldd $HOME/.nijs/store/file-*/bin/file | grep -c $HOME/.nijs/store)" = "2" ]')
            '';
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
