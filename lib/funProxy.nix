{stdenv, nodejs}:
{function, args, modules ? [], requires ? []}:

let
  nixToJS = expr:
    if expr == null then "null"
    else
      if builtins.isBool expr then
        if expr then "true" else "false"
      else if builtins.isInt expr then builtins.toString expr
      else if builtins.isString expr then "\"${expr}\""
      else if builtins.isList expr then "[ ${stdenv.lib.concatMapStrings (elem: nixToJS elem + ",\n") expr} ]"
      else if builtins.isAttrs expr then "{ ${stdenv.lib.concatMapStrings (elem: elem + " : ${nixToJS (builtins.getAttr elem expr)},\n") (builtins.attrNames expr)} }"
      else throw "Cannot convert the expression to JavaScript!";
in
import (stdenv.mkDerivation {
  name = "function-proxy";
  buildInputs = [ nodejs ] ++ modules;
  buildCommand = ''
    (
    cat <<EOF
    var nijs = require('${./nijs.js}');
    
    ${stdenv.lib.concatMapStrings (require: "var ${require.var} = require('${require.module}');\n") requires}
    
    var fun = ${function};
    
    var args = [
      ${stdenv.lib.concatMapStrings (arg: nixToJS arg+",\n") args}
    ];
    
    var result = fun.apply(this, args);
    process.stdout.write(nijs.jsToNix(result));
    EOF
    ) | node > $out
  '';
})
