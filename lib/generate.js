var nijs = require('./nijs.js');

/**
 * @member nijs
 *
 * Generates indentation to format the resulting output expression more nicely.
 *
 * @param {Number} indentLevel The indentation level of the resulting sub expression
 * @return {String} A string with the amount of whitespaces corresponding to the indent level
 */
function generateIndentation(indentLevel) {
    var expr = "";
    
    for(var i = 0; i < indentLevel; i++) {
        expr += "  ";
    }
    
    return expr;
}

exports.generateIndentation = generateIndentation;

/**
 * @member nijs
 *
 * Converts members of an object to members of an attribute set
 *
 * @param {Object} obj Object to convert
 * @param {Number} indentLevel The indentation level of the resulting sub expression
 * @return {String} A string containing the Nix attribute set members
 */
function objectMembersToAttrsMembers(obj, indentLevel) {
    var str = "";
    
    for(var attrName in obj) {
        var attrValue = obj[attrName];
        
        if(attrValue !== undefined) { // Do not convert object members whose value is undefined, but instead skip them => this is analogous to JSON
            var indentation = generateIndentation(indentLevel);
        
            /* If a JavaScript member name contains weird characters, then we must use strings as attribute keys, instead of identifiers */
            var matchedIdentifier = attrName.match(/[a-zA-Z\_][a-zA-Z0-9\_\'\-]*/);
        
            var attrKey;
        
            if(matchedIdentifier == attrName)
                attrKey = attrName;
            else
                attrKey = '"' + attrName.replace(/\"/g, '\\"') + '"';
            
            /* Create the converted Nix expression */
            str += indentation + attrKey + " = " + jsToIndentedNix(attrValue, indentLevel) + ";\n";
        }
    }
    
    return str;
}

exports.objectMembersToAttrsMembers = objectMembersToAttrsMembers;

/**
 * @member nijs
 *
 * Converts a collection of JavaScript objects to a sementically equivalent or
 * similar Nix expression language object. It also uses indentation to format the
 * resulting sub expression more nicely.
 *
 * @param {Mixed...} var_args A variable amount of parameters that can be of any JavaScript object type.
 *   The last parameter is a numeric value must be provided to specify the indentation level of the resulting sub expression.
 * @return {String} A string containing the converted Nix expression language object
 */
function jsToIndentedNix() {
    var expr = "";
    var indentLevel = arguments[arguments.length - 1];
    
    for(var i = 0; i < arguments.length - 1; i++) {
    
        var arg = arguments[i];
        
        if(i > 0)
            expr += " "; /* Add white space between every argument */
        
        if(arg === null) {
            expr += "null"; /* We must check for the null reference explicitly */
        } else {
        
            /* Use a type match to determine the conversion from a JavaScript object to a Nix expression language object */
            var type = typeof arg;
    
            switch(type) {
                case "boolean":
                    if(arg)
                        expr += "true";
                    else
                        expr += "false";
                    
                    break;

                case "number":
                    expr += arg;
                    break;
        
                case "string":
                    expr = '"'+arg.replace(/\\/g, '\\\\').replace(/\"/g, '\\"')+'"';
                    break;
        
                case "object":
                    if(Array.isArray(arg)) { /* Arrays are also objects, but this will tell us the difference */
                        expr += "[\n";
                        
                        var indentation = generateIndentation(indentLevel);
                
                        for(var i = 0; i < arg.length; i++) {
                            var listMemberExpr = jsToIndentedNix(arg[i], indentLevel + 1);
                            
                            /* Function definitions and function invocations elements in a list require ( ) wrapped around them to make them work */
                            if((arg[i] instanceof nijs.NixFunction) || (arg[i] instanceof nijs.NixFunInvocation)) {
                                listMemberExpr = "(" + listMemberExpr + ")";
                            }
                            
                            expr += indentation + "  " + listMemberExpr + "\n";
                        }
                
                        expr += indentation + "]";
                    
                    } else if(arg instanceof nijs.NixObject) {
                        
                        /* NixObject instances represent Nix expression language constructs that have no JavaScript equivalent */
                        expr += arg.toNixExpr(indentLevel);
                        
                    } else {
                        /* Consider the argument an "ordinary" JavaScript object */
                        
                        var indentation = generateIndentation(indentLevel);
                        
                        expr += "{\n";
                        expr += objectMembersToAttrsMembers(arg, indentLevel + 1);
                        expr += indentation + "}";
                    }
                    break;
        
                case "function":
                    var indentation = generateIndentation(indentLevel + 1);
                
                    for(var i = 0; i < arg.length; i++)
                        expr += "arg" + i + ": ";
                    
                    expr += "\n" + indentation + "nijsFunProxy {\n";
                    expr += indentation + "  function = ''"+arg.toString()+"'';\n";
                    expr += indentation + "  args = [\n";
                
                    for(var i = 0; i < arg.length; i++)
                        expr += indentation + "    arg" + i + "\n";
                
                    expr += indentation + "  ];\n";
                    expr += indentation + "}";
                    break;
            
                case "xml":
                    expr += '"'+arg.toXMLString().replace(/\"/g, '\\"')+'"';
                    break;
        
                case "undefined":
                    expr += "null";
                    break;
            }
        }
    }
    
    return expr;
}

exports.jsToIndentedNix = jsToIndentedNix;

/**
 * @member nijs
 *
 * Converts a collection of JavaScript objects to a sementically equivalent or
 * similar Nix expression language object.
 *
 * @param {Mixed...} var_args A variable amount of parameters that can be of any JavaScript object type.
 * @return {String} A string containing the converted Nix expression language object
 */
function jsToNix() {
    var args = Array.prototype.slice.call(arguments, 0);
    args.push(0);
    return jsToIndentedNix.apply(this, args);
}

exports.jsToNix = jsToNix;
