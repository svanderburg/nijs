{stdenv, writeTextFile, nodejs}:
{code, modules ? [], requires ? [], codeIsFunction ? false}:

import (writeTextFile {
  name = "inline-proxy.nix";
  text = "''" + ''
    (
    source ${nodejs}/nix-support/setup-hook
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
  '' + "''";
})
