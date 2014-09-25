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
      var expr = new nijs.NixLet({
        value : {
          pkgs : new nijs.NixFunInvocation({
            funExpr: new nijs.NixImport('${nixpkgs}'),
            paramExpr: {
              system: '${system}'
            }
          }),
          nijs : new nijs.NixStorePath('${nijs}'),
          nijsFunProxy: nijs.NixFunInvocation({
            funExpr: new nijs.NixImport("${nijs}/lib/node_modules/nijs/lib/funProxy.nix"),
            paramExpr: {
              stdenv: new nijs.NixInherit("pkgs"),
              nodejs: new nijs.NixInherit("pkgs"),
              nijs: new nijs.NixInherit()
            }
          }),
          newInlineProxy : new nijs.NixFunInvocation({
            funExpr: new nijs.NixImport("${nijs}/lib/node_modules/nijs/lib/inlineProxy.nix"),
            paramExpr: {
              stdenv: new nijs.NixInherit("pkgs"),
              writeTextFile: new nijs.NixInherit("pkgs"),
              nodejs: new nijs.NixInherit("pkgs"),
              nijs: new nijs.NixInherit()
            }
          })
        },
        body : pkgsJsFile.pkgs['${attrName}']()
      });

      fs.writeFileSync(process.env['out'], nijs.jsToNix(expr));
    '';
  };
})
