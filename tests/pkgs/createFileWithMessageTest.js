var nijs = require('nijs');

exports.pkg = function(args) {
  return args.stdenv().mkDerivation ({
    name : "createFileWithMessageTest",
    buildCommand : new nijs.NixInlineJS({
      requires : [
        { "var" : "fs", "module" : "fs" },
        { "var" : "path", "module" : "path" }
      ],
      code : function() {
        fs.mkdirSync(process.env['out']);
        var message = "Hello world written through inline JavaScript!";
        fs.writeFileSync(path.join(process.env['out'], "message.txt"), message);
      }
    })
  });
};
