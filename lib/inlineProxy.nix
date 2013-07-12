{stdenv, writeTextFile, nodejs}:
{name ? null, code, modules ? [], requires ? [], NODE_PATH ? "", codeIsFunction ? false}:

writeTextFile {
  name = "inline-proxy${if name == null then "" else "-${name}"}";
  executable = true;
  text = ''
    (
    source ${stdenv}/setup
    source ${nodejs}/nix-support/setup-hook
    export NODE_PATH=$NODE_PATH${stdenv.lib.optionalString (NODE_PATH != "") ''''${NODE_PATH:+:}${NODE_PATH}''}
    ${stdenv.lib.concatMapStrings (module: "addNodePath ${module}\n") modules}
    
    (
    cat << "__EOF__"
    ${stdenv.lib.concatMapStrings (require: "var ${require.var} = require('${require.module}');\n") requires}

    ${if codeIsFunction then ''
      var fun = ${code};
      fun();
    '' else code}
    __EOF__
    ) | ${nodejs}/bin/node)
  '';
}
