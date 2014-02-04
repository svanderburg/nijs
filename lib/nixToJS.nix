{stdenv}:
expr:

let
  nixToJS = expr:
    let
      exprType = builtins.typeOf expr;
    in
    if exprType == "int" then builtins.toString expr
    else if exprType == "bool" then
      if expr then "true" else "false"
    else if exprType == "string" then "\"${expr}\""
    else if exprType == "path" then "new nijs.NixFile({ value: ${builtins.toString expr} })"
    else if exprType == "set" then "{ ${stdenv.lib.concatMapStrings (elem: "\"${elem}\" : ${nixToJS (builtins.getAttr elem expr)},\n") (builtins.attrNames expr)} }"
    else if exprType == "list" then "[ ${stdenv.lib.concatMapStrings (elem: nixToJS elem + ",\n") expr} ]"
    else if exprType == "lambda" then "Cannot convert lambda to JavaScript"
    else throw "Cannot convert this expression to JavaScript";
in
nixToJS expr
