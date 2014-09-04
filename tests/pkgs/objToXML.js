var nijs = require('nijs');

exports.pkg = function(args) {
  var data = {
    "number": 1,
    "string": "Hello world",
    "URL": new nijs.NixURL("http://github.com"),
    "null": null,
    "undefined": undefined, // This member should not be visible in the resulting XML
    "listOfStrings": [ "a", "b", "c", 1, 2, 3 ],
    "recursiveAttrSet": new nijs.NixRecursiveAttrSet({
      "number": 2
    })
  };
  
  return new nijs.NixLet({
    value: {
      dataXML: new nijs.NixFunInvocation({
        funExpr: new nijs.NixExpression("builtins.toXML"),
        paramExpr: data
      })
    },
    body: args.writeTextFile({
      name : "objToXML",
      text : new nijs.NixExpression("dataXML")
    })
  });
};
