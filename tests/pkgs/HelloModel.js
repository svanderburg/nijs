var nijs = require('nijs');
var inherit = require('nijs/lib/ast/util/inherit.js').inherit;
var HelloSourceModel = require('./HelloModel/HelloSourceModel.js').HelloSourceModel;

function HelloModel(args) {
    this.args = args;

    this.name = "hello-2.12";
    this.source = new HelloSourceModel(args);
    this.meta = {
        description: "A program that produces a familiar, friendly greeting",
        homepage: "http://www.gnu.org/software/hello/manual",
        license: "GPLv3+"
    };
}

/* HelloModel inherits from NixASTNode */
inherit(nijs.NixASTNode, HelloModel);

/**
 * @see NixASTNode#toNixAST
 */
HelloModel.prototype.toNixAST = function() {
    var self = this;

    var metadataWrapper = {
        toNixAST: function() {
            return {
                description: self.meta.description,
                homepage: new nijs.NixURL(self.meta.homepage),
                license: self.meta.license
            };
        }
    };

    return this.args.stdenv().mkDerivation ({
        name: this.name,
        src: this.source,
        doCheck: true,
        meta: new nijs.NixASTNode(metadataWrapper)
    });
};

exports.pkg = function(args) {
    return new HelloModel(args);
};
