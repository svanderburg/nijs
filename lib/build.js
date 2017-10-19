/**
 * Contains utility functions that build packages with the Nix package manager
 * @module build
 */
var path = require('path');
var child_process = require('child_process');
var nijs = require('./nijs.js');

function nixBuild(args) {
    var output = "";

    /* Spawn nix-build process */
    var nixBuildProcess = child_process.spawn("nix-build", args.params.concat(["-"]));

    nixBuildProcess.stdin.write(args.expression);
    nixBuildProcess.stdin.end();

    nixBuildProcess.stdout.on("data", function(data) {
        output += data; /* Capture the Nix store path */
    });

    nixBuildProcess.stderr.on("data", function(data) {
        process.stderr.write(data);
    });

    nixBuildProcess.on("exit", function(code) {
        if(code == 0)
            args.callback(null, output.substring(0, output.length - 1));
        else
            args.callback("nix-build exited with status: "+code);
    });
};

/**
 * Invokes the nix-build process to evaluate a given nix object containing a Nix
 * expression. As a side-effect, the declared package gets built.
 *
 * @function
 * @param {Object} args Nix build parameters
 * @param {String} args.expression A string containing a Nix expression
 * @param {String[]} args.params An array of strings representing command-line parameters passed to nix-build
 * @param {function(number, string)} args.callback Callback function that gets called with the non-zero exit status if the build fails, or the resulting Nix store path if it succeeds
 */
exports.nixBuild = nixBuild;

function callNixBuild(args) {
    var pkgsExpression;

    if(args.pkgsExpression === undefined)
        pkgsExpression = "import <nixpkgs> {}";
    else
        pkgsExpression = args.pkgsExpression;

    /*
     * Hacky way to determine whether nijs is deployed by Nix or NPM.
     * If deployed by the latter, we need to somehow get it in the Nix store
     * when invoking JavaScript functions or inline JavaScript
     */

    var modulePathComponents = module.filename.split(path.sep);
    var nijsPath;

    if(modulePathComponents.length >= 8) {
        var rootPathComponent = modulePathComponents[modulePathComponents.length - 6];

        if(rootPathComponent.substring(32, 33) == "-") // This looks very much like a Nix store path
            nijsPath = "builtins.storePath " + path.resolve(path.join(path.dirname(module.filename), "..", "..", "..", ".."));
        else
            nijsPath = "builtins.getAttr (builtins.currentSystem) ((import " + path.resolve(path.join(path.dirname(module.filename), "..", "release.nix")) + " {}).build)";
    }

    /* Generate a Nix expression and evaluate it */
    var expression = "let\n"+
      "  pkgs = " + pkgsExpression + ";\n"+
      "  nijs = "+ nijsPath + ";\n"+
      '  nijsFunProxy = import "${nijs}/lib/node_modules/nijs/lib/funProxy.nix" { inherit (pkgs) stdenv nodejs; inherit nijs; };\n'+
      '  nijsInlineProxy = import "${nijs}/lib/node_modules/nijs/lib/inlineProxy.nix" { inherit (pkgs) stdenv writeTextFile nodejs; inherit nijs; };\n'+
      "in\n" +
      args.nixExpression;
 
    nixBuild({
        expression : expression,
        params : args.params,
        callback : args.callback
    });
}

/**
 * Augments a given Nix object with a Nix expression with a Nixpkgs and NiJS
 * reference and executes nix-build to evaluate the expression.
 *
 * @function
 * @param {Object} args Nix build parameters
 * @param {String} args.nixExpression A string that contains a Nix expression
 * @param {String[]} args.params An array of strings representing command-line parameters passed to nix-build
 * @param {String} args.pkgsExpression An optional string containing a Nix expression importing the Nix packages collection. Defaults to the system's nixpkgs setting.
 * @param {function(number, string)} args.callback Callback function that gets called with the non-zero exit status if the build fails, or the resulting Nix store path if it succeeds
 */
exports.callNixBuild = callNixBuild;
