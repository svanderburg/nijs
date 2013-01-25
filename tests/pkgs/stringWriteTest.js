exports.pkg = function(args) {
  return args.writeTextFile ({
    name : "stringWriteTest",
    text : "I'd like to say: \"Hello World!\""
  });
}
