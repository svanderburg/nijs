{stdenv, nijsFunProxy}:

let
  appendTwoStrings = a: b: nijsFunProxy {
    function = ''
      function appendTwoStrings(a, b) {
        return a + " " + b;
      }
    '';
    args = [ a b ];
  };
in
stdenv.mkDerivation {
  name = "appendTwoStrings";
  
  buildCommand = ''
    echo ${appendTwoStrings "Hello" "world"} > $out
  '';
}
