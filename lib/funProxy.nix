{stdenv, nodejs, nijs}:
{name ? null, function, args, modules ? [], requires ? [], NODE_PATH ? "", async ? false}:

let
  nixToJS = import ./nixToJS.nix { inherit stdenv; };
in
import (stdenv.mkDerivation {
  name = "function-proxy${if name == null then "" else "-${name}"}.nix";
  inherit NODE_PATH;
  buildInputs = [ nodejs nijs ] ++ modules;
  buildCommand = ''
    (
    cat <<EOF
    var fs = require('fs');
    var nijs = require('nijs');
    
    /* Import all the CommonJS modules that we like to use in this function */
    ${stdenv.lib.concatMapStrings (require: "var ${require.var} = require('${require.module}');\n") requires}
    
    /* Define the JavaScript function */
    var fun = ${function};
    
    /* Convert the function arguments to JavaScript */
    var args = [
      ${stdenv.lib.concatMapStrings (arg: nixToJS arg+",\n") args}
    ];
    
    /* Define callback interfaces for asynchronous functions */
    
    var nijsCallbacks = {
        callback : function(err, result) {
            if(err) {
                process.stderr.write(err);
                process.exit(1);
            } else {
                fs.writeFileSync("$out", nijs.jsToNix(result));
            }
        }
    };
    
    /* Evaluate the function */
    var result = fun.apply(this, args);
    
    ${stdenv.lib.optionalString (!async) ''
      /* Return the evaluation result */
      nijsCallbacks.callback(null, result);
    ''}
    EOF
    ) | node
  '';
})
