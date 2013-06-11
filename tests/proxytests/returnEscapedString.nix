{stdenv, nijsFunProxy}:

let
  returnEscapedString = nijsFunProxy {
    name = "returnEscapedString";
    function = ''
      function returnEscapedString() {
          var message = 'Hello \\\"escaped\\\" world';
          process.stderr.write("Supposed to return: [" + message + "]\n");
          return message;
      }
    '';
    args = [];
  };
in
stdenv.mkDerivation {
  name = "returnEscapedString";
  
  buildCommand = ''
    cat > $out <<EOF
    ${returnEscapedString}
    EOF
  '';
}
