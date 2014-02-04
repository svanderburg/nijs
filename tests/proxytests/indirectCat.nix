{stdenv, nijsFunProxy}:

let
  passMessageFile = messageFile: nijsFunProxy {
    name = "sum";
    
    requires = [
      { var = "fs"; module = "fs"; }
    ];
    
    function = ''
      function passMessageFile(messageFile) {
        return messageFile;
      }
    '';
    args = [ messageFile ];
  };
in
stdenv.mkDerivation {
  name = "indirectCopy";
  buildCommand = ''
    cat ${passMessageFile ./message.txt} > $out
  '';
}
