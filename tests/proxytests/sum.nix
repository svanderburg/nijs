{stdenv, nijsFunProxy}:

let
  sum = a: b: nijsFunProxy {
    function = ''
      function sum(a, b) {
        return a + b;
      }
    '';
    args = [ a b ];
  };
in
stdenv.mkDerivation {
  name = "sum";
  
  buildCommand = ''
    echo ${toString (sum 1 2)} > $out
  '';
}
