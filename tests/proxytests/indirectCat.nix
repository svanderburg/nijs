{stdenv, nijsFunProxy}:

let
  passMessageFile = messageFile: nijsFunProxy {
    name = "sum";
    
    requires = [
      { var = "fs"; module = "fs"; }
    ];
    
    function = ''
      function passMessageFile(messageFile) {
        var message = fs.readFileSync(messageFile.value);
        return message.toString();
      }
    '';
    args = [ messageFile ];
  };
in
stdenv.mkDerivation {
  name = "indirectCat";
  buildCommand = ''
    echo ${passMessageFile ./message.txt} > $out
  '';
}
