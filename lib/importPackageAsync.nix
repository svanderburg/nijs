{nixpkgs, system, nijs}:
{pkgsJsFile, attrName, format ? false}:

let
  pkgs = import nixpkgs { inherit system; };

  nijsInlineProxy = import ./inlineProxy.nix {
    inherit (pkgs) stdenv writeTextFile nodejs;
    inherit nijs;
  };
in
import (pkgs.stdenv.mkDerivation {
  name = "importPackageAsync-${attrName}.nix";
    
  buildCommand = nijsInlineProxy {
    name = "importPackageAsync-${attrName}-buildCommand";
    modules = [ pkgs.nodePackages.slasp ];
    requires = [
      { var = "fs"; module = "fs"; }
      { var = "slasp"; module = "slasp"; }
      { var = "pkgsJsFile"; module = pkgsJsFile; }
    ];
    code = ''
      slasp.sequence([
          function(callback) {
              pkgsJsFile.pkgs['${attrName}'](callback);
          },
          
          function(callback, _expr) {
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
                              nodejs: new nijs.NixInherit("pkgs"),
                              nijs: new nijs.NixInherit()
                          }
                      }),
                      nijsInlineProxy : new nijs.NixFunInvocation({
                          funExpr: new nijs.NixImport(new nijs.NixStorePath("${nijs}/lib/node_modules/nijs/lib/inlineProxy.nix")),
                          paramExpr: {
                              stdenv: new nijs.NixInherit("pkgs"),
                              writeTextFile: new nijs.NixInherit("pkgs"),
                              nodejs: new nijs.NixInherit("pkgs"),
                              nijs: new nijs.NixInherit()
                          }
                      })
                  },
                  body : _expr
              });
              
              fs.writeFile(process.env['out'], nijs.jsToNix(expr, ${if format then "true" else "false"}), callback);
          },
      ], function(err) {
          if(err) {
              process.stderr.write(err + '\n');
              process.exit(1);
          }
      });
    '';
  };
})
