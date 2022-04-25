var nijs = require('nijs');
var inherit = require('nijs/lib/ast/util/inherit.js').inherit;

function HelloSourceModel(args) {
    this.args = args;
    this.src = "mirror://gnu/hello/hello-2.12.tar.gz";
    this.sha256 = "1ayhp9v4m4rdhjmnl2bq3cibrbqqkgjbl3s7yk2nhlh8vj3ay16g";
}

/* HelloSourceModel inherits from NixASTNode */
inherit(nijs.NixASTNode, HelloSourceModel);

/**
 * @see NixASTNode#toNixAST
 */
HelloSourceModel.prototype.toNixAST = function() {
    return this.args.fetchurl()({
        url: new nijs.NixURL(this.src),
        sha256: this.sha256
    });
};

exports.HelloSourceModel = HelloSourceModel;
