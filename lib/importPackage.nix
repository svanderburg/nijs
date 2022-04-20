{nixpkgs, system, nijs}:
{pkgsJsFile, attrName, format ? false}:

let
  pkgs = import nixpkgs { inherit system; };

  nijsInlineProxy = import ./inlineProxy.nix {
    inherit (pkgs) stdenv lib writeTextFile nodejs;
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
            funExpr: new nijs.NixImport(new nijs.NixStorePath('${nixpkgs}')),
            paramExpr: {
              system: '${system}'
            }
          }),
          nijs : new nijs.NixStorePath('${nijs}'),
          nijsFunProxy: new nijs.NixFunInvocation({
            funExpr: new nijs.NixImport(new nijs.NixStorePath("${nijs}/lib/node_modules/nijs/lib/funProxy.nix")),
            paramExpr: {
              stdenv: new nijs.NixInherit("pkgs"),
              lib: new nijs.NixInherit("pkgs"),
              nodejs: new nijs.NixInherit("pkgs"),
              nijs: new nijs.NixInherit()
            }
          }),
          nijsInlineProxy : new nijs.NixFunInvocation({
            funExpr: new nijs.NixImport(new nijs.NixStorePath("${nijs}/lib/node_modules/nijs/lib/inlineProxy.nix")),
            paramExpr: {
              stdenv: new nijs.NixInherit("pkgs"),
              lib: new nijs.NixInherit("pkgs"),
              writeTextFile: new nijs.NixInherit("pkgs"),
              nodejs: new nijs.NixInherit("pkgs"),
              nijs: new nijs.NixInherit()
            }
          })
        },
        body : pkgsJsFile.pkgs['${attrName}']()
      });

      fs.writeFileSync(process.env['out'], nijs.jsToNix(expr, ${if format then "true" else "false"}));
    '';
  };
})
