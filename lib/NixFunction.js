/**
 * @class NixFunction
 * Captures the abstract syntax of a Nix function consisting of an argument and
 * function body.
 */
 
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

exports.NixFunction = NixFunction;
