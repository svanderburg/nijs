var nijs = require('nijs');

exports.pkg = function(args) {
  return new nijs.NixAssert({
    conditionExpr: new nijs.NixExpression(true),
    body: new nijs.NixLet({
      value: {
        test: true
      },
      body: args.writeTextFile({
        name : "conditionals",
        text : new nijs.NixIf({
          ifExpr: new nijs.NixExpression("test"),
          thenExpr: "It is true!",
          elseExpr: "It is false!"
        })
      })
    })
  });
};
