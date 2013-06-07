{stdenv, underscore, nijsInlineProxy}:

stdenv.mkDerivation {
  name = "createFileWithUnderscore";
  buildCommand = nijsInlineProxy {
    name = "createFileWithUnderscore-buildCommand";
    modules = [ underscore ];
    requires = [
      { var = "fs"; module = "fs"; }
      { var = "_"; module = "underscore"; }
    ];
    code = ''
      var words = [ "This", "is", "very", "cool" ];
      var message = _.sortBy(words, function(word) {
          return word.toLowerCase().charAt(0);
      });
      
      fs.writeFileSync(process.env['out'], message.toString());
    '';
  };
}
