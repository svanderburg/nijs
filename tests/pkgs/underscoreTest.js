var nijs = require('nijs');

var proxytests = new nijs.NixFunInvocation({
  funExpr: new nijs.NixImport(
    new nijs.NixFile({
      value: "../proxytests.nix",
      module: module
    })
  ),
  paramExpr: {
    pkgs: new nijs.NixInherit(),
    nijs: new nijs.NixInherit()
  }
});

exports.pkg = new nijs.NixAttrReference({
  attrSetExpr: proxytests,
  refExpr: new nijs.NixExpression("underscoreTest")
});
