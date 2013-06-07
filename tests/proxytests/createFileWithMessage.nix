{stdenv, nijsInlineProxy}:

stdenv.mkDerivation {
  name = "createFileWithMessage";
  buildCommand = nijsInlineProxy {
    name = "createFileWithMessage-buildCommand";
    requires = [
      { var = "fs"; module = "fs"; }
      { var = "path"; module = "path"; }
    ];
    code = ''
      fs.mkdirSync(process.env['out']);
      var message = "Hello world written through inline JavaScript!";
      fs.writeFileSync(path.join(process.env['out'], "message.txt"), message);
    '';
  };
}
