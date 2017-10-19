var inherit = require('./util/inherit.js').inherit;
var NixBlock = require('./NixBlock.js').NixBlock;
var nijs = require('../nijs.js');

/**
 * Creates a new NixFunction instance.
 *
 * @class NixFunction
 * @extends NixBlock
 * @classdesc Captures the abstract syntax of a Nix function consisting of an
 * argument and function body.
 *
 * @constructor
 * @param {Object} args Arguments to this function
 * @param {Mixed} args.argSpec Argument specification of the function. If a string is
 *     given then the resulting function takes a single parameter with that name.
 *     If an array or object is given, then it's converted to an attribute set
 *     taking multiple parameters. In the former case, the array values correspond
 *     to the parameter names. In the latter case, the object keys are used as
 *     parameter names and their values are considered default values.
 * @param {Mixed} args.body The body of the function, which can be a JavaScript object or an instance of the NixObject prototype
 */
function NixFunction(args) {
    if(args.argSpec === null) {
        throw "Cannot derivate function argument specification from a null reference";
    } else if(typeof args.argSpec == "string" || typeof args.argSpec == "object") {
        this.argSpec = args.argSpec;
        this.body = args.body;
    } else {
        throw "Cannot derive function argument specification from an object of type: "+args.argSpec;
    }
}

/* NixFunction inherits from NixBlock */
inherit(NixBlock, NixFunction);

/**
 * @see NixObject#toNixExpr
 */
NixFunction.prototype.toNixExpr = function(indentLevel, format) {
    var expr = "";

    /* Generate the function header */
    if(typeof this.argSpec == "string") {
        expr += this.argSpec + ": "; // Use a positional argument when the argument attribute is a string
    } else {
        expr += "{";

        if(Array.isArray(this.argSpec)) {
            // An array gets converted into an argument attribute set with no default parameters
            for(var i = 0; i < this.argSpec.length; i++) {
                expr += this.argSpec[i];

                if(i < this.argSpec.length - 1)
                    expr += ", ";
            }
        } else {
            var first = true;

            // An object gets converted into an argument attribute set in which the keys correspond to the parameter names and values to the default parameters
            for(var varName in this.argSpec) {
                var value = this.argSpec[varName];

                if(first)
                    first = false;
                else
                    expr += ", ";

                expr += varName;

                /* If the value is defined, consider it a default value */
                if(value !== undefined)
                    expr += " ? " + nijs.jsToIndentedNix(value, indentLevel + 1, format);
            }
        }

        expr += "}:\n\n" + nijs.generateIndentation(indentLevel, format);
    }

    /* Generate the function body */
    expr += nijs.jsToIndentedNix(this.body, indentLevel, format);

    /* Return the generated expression */
    return expr;
};

exports.NixFunction = NixFunction;
