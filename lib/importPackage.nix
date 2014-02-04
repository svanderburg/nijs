{nixpkgs, system, nijs}:
{pkgsJsFile, attrName}:

let
  pkgs = import nixpkgs { inherit system; };

  nijsInlineProxy = import ./inlineProxy.nix {
    inherit (pkgs) stdenv writeTextFile nodejs;
    inherit nijs;
  };
in
import (pkgs.stdenv.mkDerivation {
  name = "importPackage-${attrName}.nix";
    
  buildCommand = nijsInlineProxy {
    name = "importPackage-${attrName}-buildCommand";
    requires = [
      { var = "fs"; module = "fs"; }
      { var = "pkgsJsFile"; module = pkgsJsFile; }
    ];
    code = ''
      var expr = pkgsJsFile.pkgs['${attrName}']();
      
      expr = new nijs.NixLet({
        value : {
          pkgs : new nijs.NixExpression('import ${nixpkgs} { system = "${system}"; }'),
          nijs : new nijs.NixExpression('builtins.storePath ${nijs}'),
          nijsFunProxy : new nijs.NixExpression('import ${nijs}/lib/node_modules/nijs/lib/funProxy.nix { inherit (pkgs) stdenv nodejs; inherit nijs; }'),
          nijsInlineProxy : new nijs.NixExpression('import ${nijs}/lib/node_modules/nijs/lib/inlineProxy.nix { inherit (pkgs) stdenv writeTextFile nodejs; inherit nijs; }')
        },
        body : expr
      });

      fs.writeFileSync(process.env['out'], nijs.jsToNix(expr));
    '';
  };
})
