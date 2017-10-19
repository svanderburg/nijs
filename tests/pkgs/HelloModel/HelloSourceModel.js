var nijs = require('nijs');
var inherit = require('nijs/lib/ast/util/inherit.js').inherit;

function HelloSourceModel(args) {
    this.args = args;
    this.src = "mirror://gnu/hello/hello-2.10.tar.gz";
    this.sha256 = "0ssi1wpaf7plaswqqjwigppsg5fyh99vdlb9kzl7c9lng89ndq1i";
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
