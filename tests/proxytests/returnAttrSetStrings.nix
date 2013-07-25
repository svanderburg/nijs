{stdenv, nijsFunProxy}:

let
  returnAttrSetStrings = nijsFunProxy {
    name = "returnAttrSetStrings";
    function = ''
      function returnAttrSetStrings() {
          return {
              first: "Hello",
              ",": ", ",
              "second/third/fourth": "how are you?"
          };
      }
    '';
    args = [];
  };
in
stdenv.mkDerivation {
  name = "returnAttrSetStrings";
  
  buildCommand = ''
    cat > $out <<EOF
    ${returnAttrSetStrings.first}${returnAttrSetStrings.","}${returnAttrSetStrings."second/third/fourth"}
    EOF
  '';
}
