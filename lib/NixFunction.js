/**
 * @class NixFunction
 * @extends NixObject
 *
 * Captures the abstract syntax of a Nix function consisting of an argument and
 * function body.
 */

var inherit = require('./inherit.js').inherit;
var NixObject = require('./NixObject.js').NixObject;
var nijs = require('./nijs.js');

/**
 * @constructor
 * Creates a new NixFunction instance.
 *
 * @param {Mixed} argSpec Argument specification of the function. If a string is
 *     given then the resulting function takes a single parameter with that name.
 *     If an array or object is given, then it's converted to an attribute set
 *     taking multiple parameters. In the former case, the array values correspond
 *     to the parameter names. In the latter case, the object keys are used as
 *     parameter names and their values are considered default values.
 * @param {Object} body The body of the function, which can be a JavaScript object or an instance of the NixObject prototype
 */
function NixFunction(argSpec, body) {
    if(argSpec === null) {
        throw "Cannot derivate function argument specification from a null reference";
    } else if(typeof argSpec == "string" || typeof argSpec == "object") {
        this.argSpec = argSpec;
        this.body = body;
    } else {
        throw "Cannot derive function argument specification from an object of type: "+argSpec;
    }
}

/* NixFunction inherits from NixObject */
inherit(NixObject, NixFunction);

/**
 * @see NixObject#toNixExpr
 */
NixFunction.prototype.toNixExpr = function() {
    var expr = "(";
    
    /* Generate the function header */
    if(typeof this.argSpec == "string")
        expr += this.argSpec + ": ";
    else {
        expr += "{";
        
        if(Array.isArray(this.argSpec)) {

            for(var j = 0; j < this.argSpec.length; j++) {
                expr += this.argSpec[j];
            
                if(j < this.argSpec.length - 1)
                    expr += ", ";
            }
        } else {
            var first = true;
            
            for(var varName in this.argSpec) {
                var value = this.argSpec[varName];
                
                if(first)
                    first = false;
                else
                    expr += ", ";
                
                 expr += varName;
                
                /* If the value is defined, consider it a default value */
                if(value !== undefined)
                    expr += " ? " + nijs.jsToNix(value);
            }
        }
        
        expr += "}: ";
    }
    
    /* Generate the function body */
    
    expr += nijs.jsToNix(this.body);
    expr += ")";
    
    /* Return the generated expression */
    return expr;
};

exports.NixFunction = NixFunction;
