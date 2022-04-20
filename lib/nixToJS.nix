{lib}:
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
    else if exprType == "path" then "new nijs.NixStorePath(\"${expr}\")"
    else if exprType == "null" then "null"
    else if exprType == "set" then "{ ${lib.concatMapStrings (elem: "\"${elem}\" : ${nixToJS (builtins.getAttr elem expr)},\n") (builtins.attrNames expr)} }"
    else if exprType == "list" then "[ ${lib.concatMapStrings (elem: nixToJS elem + ",\n") expr} ]"
    else if exprType == "lambda" then "Cannot convert a lambda to JavaScript"
    else "\"${expr}\""; # It's most likely a Nix store path that gets evaluated if none of the other types match. Simply convert this to a string
in
nixToJS expr
