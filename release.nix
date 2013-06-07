{ nixpkgs ? <nixpkgs>
, system ? builtins.currentSystem
}:

let
  pkgs = import nixpkgs { inherit system; };
  
  version = builtins.readFile ./version;
  
  importNijsPackage = {pkgsJsFile, attrName}:
    let nijsInlineProxy = import ./lib/inlineProxy.nix {
      inherit (pkgs) stdenv writeTextFile nodejs;
    };
    in
    import (pkgs.stdenv.mkDerivation {
      name = "importnijs-${attrName}.nix";
        
      buildCommand = nijsInlineProxy {
        name = "${attrName}-buildCommand";
        requires = [
          { var = "fs"; module = "fs"; }
          { var = "pkgsJsFile"; module = pkgsJsFile; }
          { var = "nijs"; module = "${./.}/lib/nijs.js"; }
        ];
        code = ''
          var expr = pkgsJsFile.pkgs['${attrName}']();
          expr = new nijs.NixExpression('let\n' +
              '  pkgs = import ${nixpkgs} { system = "${system}"; };\n' +
              '  nijsFunProxy = import ${./.}/lib/funProxy.nix { inherit (pkgs) stdenv nodejs; };\n' +
              '  nijsInlineProxy = import ${./.}/lib/inlineProxy.nix { inherit (pkgs) stdenv writeTextFile nodejs; };\n' +
              'in\n' +
              expr.value);
            
          fs.writeFileSync(process.env['out'], nijs.jsToNix(expr));
        '';
      };
    });
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
        hello = importNijsPackage { inherit pkgsJsFile; attrName = "hello"; };
        zlib = importNijsPackage { inherit pkgsJsFile; attrName = "zlib"; };
        file = importNijsPackage { inherit pkgsJsFile; attrName = "file"; };
        perl = importNijsPackage { inherit pkgsJsFile; attrName = "perl"; };
        openssl = importNijsPackage { inherit pkgsJsFile; attrName = "openssl"; };
        curl = importNijsPackage { inherit pkgsJsFile; attrName = "curl"; };
        wget = importNijsPackage { inherit pkgsJsFile; attrName = "wget"; };
        sumTest = importNijsPackage { inherit pkgsJsFile; attrName = "sumTest"; };
        stringWriteTest = importNijsPackage { inherit pkgsJsFile; attrName = "stringWriteTest"; };
        appendFilesTest = importNijsPackage { inherit pkgsJsFile; attrName = "appendFilesTest"; };
        createFileWithMessageTest = importNijsPackage { inherit pkgsJsFile; attrName = "createFileWithMessageTest"; };
      };
    };
}
