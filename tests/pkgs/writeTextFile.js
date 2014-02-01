var nijs = require('nijs');

exports.pkg = function(args) {
    return new nijs.NixExpression("pkgs.writeTextFile "+nijs.jsToNix(args));
};
