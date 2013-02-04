{stdenv, underscore, nijsFunProxy}:

let
  underscoreTestFun = numbers: nijsFunProxy {
    function = ''
      function underscoreTestFun(numbers) {
        var words = [ "one", "two", "three", "four", "five" ];
        var result = [];
          
        _.each(numbers, function(elem) {
          result.push(words[elem - 1]);
        });
        
        return result;
      }
    '';
    args = [ numbers ];
    modules = [ underscore ];
    requires = [
      { var = "_"; module = "underscore"; }
    ];
  };
in
stdenv.mkDerivation {
  name = "underscoreTest";
  
  buildCommand = ''
    echo ${toString (underscoreTestFun [ 5 4 3 2 1 ])} > $out
  '';
}
