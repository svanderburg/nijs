{stdenv, nodejs}:
{function, args, modules ? [], requires ? []}:

let
  nixToJS = import ./nixToJS.nix { inherit stdenv; };
in
import (stdenv.mkDerivation {
  name = "function-proxy";
  buildInputs = [ nodejs ] ++ modules;
  buildCommand = ''
    (
    cat <<EOF
    var fs = require('fs');
    var nijs = require('${./nijs.js}');
    
    ${stdenv.lib.concatMapStrings (require: "var ${require.var} = require('${require.module}');\n") requires}
    
    var fun = ${function};
    
    var args = [
      ${stdenv.lib.concatMapStrings (arg: nixToJS arg+",\n") args}
    ];
    
    var result = fun.apply(this, args);
    fs.writeFileSync("$out", nijs.jsToNix(result));
    EOF
    ) | node > $out
  '';
})
