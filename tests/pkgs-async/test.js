var nijs = require('nijs');
var slasp = require('slasp');

exports.pkg = function(args, callback) {
  args.stdenv().mkDerivation ({
    name : "test",
    buildCommand : 'echo "Hello world!" > $out'
  }, callback);
};
