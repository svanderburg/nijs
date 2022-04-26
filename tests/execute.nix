{nixpkgs, pkgs, tarball, nijs}:

let
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
}
