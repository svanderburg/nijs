var nijs = require('../../lib/nijs.js');

exports.pkg = function(args) {
    return new nijs.NixExpression("pkgs.writeTextFile "+nijs.jsToNix(args));
};
