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
                      pkgs : new nijs.NixExpression('import ${nixpkgs} { system = "${system}"; }'),
                      nijs : new nijs.NixExpression('builtins.storePath ${nijs}'),
                      nijsFunProxy : new nijs.NixExpression('import ${nijs}/lib/node_modules/nijs/lib/funProxy.nix { inherit (pkgs) stdenv nodejs; inherit nijs; }'),
                      nijsInlineProxy : new nijs.NixExpression('import ${nijs}/lib/node_modules/nijs/lib/inlineProxy.nix { inherit (pkgs) stdenv writeTextFile nodejs; inherit nijs; }')
                  },
                  body : _expr
              });
              
              fs.writeFile(process.env['out'], nijs.jsToNix(expr), callback);
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
