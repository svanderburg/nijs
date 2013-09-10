/**
 * @class NixFunInvocation
 * Captures the abstract syntax of a Nix function invocation consisting of an
 * expression yielding a function definition and an expression capturing the
 * parameter.
 */
 
/**
 * @constructor
 * Creates a new NixFunInvocation instance.
 *
 * @param {Mixed} funExpr An object representing an expression that yields a function definition
 * @param {Mixed} paramExpr An object representing an expression that yields the function parameter
 */

function NixFunInvocation(funExpr, paramExpr) {
    this.funExpr = funExpr;
    this.paramExpr = paramExpr;
}

exports.NixFunInvocation = NixFunInvocation;
