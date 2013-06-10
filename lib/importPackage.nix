{nixpkgs, system}:
{pkgsJsFile, attrName}:

let
  pkgs = import nixpkgs { inherit system; };

  nijsInlineProxy = import ./inlineProxy.nix {
    inherit (pkgs) stdenv writeTextFile nodejs;
  };
in
import (pkgs.stdenv.mkDerivation {
  name = "importpackage-${attrName}.nix";
    
  buildCommand = nijsInlineProxy {
    name = "${attrName}-buildCommand";
    requires = [
      { var = "fs"; module = "fs"; }
      { var = "nijs"; module = "${./.}/nijs.js"; }
      { var = "pkgsJsFile"; module = pkgsJsFile; }
    ];
    code = ''
      var expr = pkgsJsFile.pkgs['${attrName}']();
      expr = new nijs.NixExpression('let\n' +
        '  pkgs = import ${nixpkgs} { system = "${system}"; };\n' +
        '  nijsFunProxy = import ${./.}/funProxy.nix { inherit (pkgs) stdenv nodejs; };\n' +
        '  nijsInlineProxy = import ${./.}/inlineProxy.nix { inherit (pkgs) stdenv writeTextFile nodejs; };\n' +
        'in\n' +
        expr.value);
        
      fs.writeFileSync(process.env['out'], nijs.jsToNix(expr));
    '';
  };
})
