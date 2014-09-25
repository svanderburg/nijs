/**
 * @static @class nijs
 * Contains functions that convert a CommonJS module declaring packages into Nix
 * expressions and a way to execute them.
 */

var generate = require('./generate.js');
var execute = require('./execute');
var build = require('./build.js');

/* Prototypes for abstract syntax objects */
var NixObject = require('./ast/NixObject.js').NixObject;
var NixValue = require('./ast/NixValue.js').NixValue;
var NixBlock = require('./ast/NixBlock.js').NixBlock;
var NixFile = require('./ast/NixFile.js').NixFile;
var NixURL = require('./ast/NixURL.js').NixURL;
var NixRecursiveAttrSet = require('./ast/NixRecursiveAttrSet.js').NixRecursiveAttrSet;
var NixLet = require('./ast/NixLet.js').NixLet;
var NixExpression = require('./ast/NixExpression.js').NixExpression;
var NixFunction = require('./ast/NixFunction.js').NixFunction;
var NixFunInvocation = require('./ast/NixFunInvocation.js').NixFunInvocation;
var NixAttrReference = require('./ast/NixAttrReference.js').NixAttrReference;
var NixWith = require('./ast/NixWith.js').NixWith;
var NixInherit = require('./ast/NixInherit.js').NixInherit;
var NixInlineJS = require('./ast/NixInlineJS.js').NixInlineJS;
var NixImport = require('./ast/NixImport.js').NixImport;
var NixAssert = require('./ast/NixAssert.js').NixAssert;
var NixIf = require('./ast/NixIf.js').NixIf;
var NixStorePath = require('./ast/NixStorePath.js').NixStorePath;

exports.NixObject = NixObject;
exports.NixValue = NixValue;
exports.NixBlock = NixBlock;
exports.NixFile = NixFile;
exports.NixURL = NixURL;
exports.NixRecursiveAttrSet = NixRecursiveAttrSet;
exports.NixLet = NixLet;
exports.NixExpression = NixExpression;
exports.NixFunction = NixFunction;
exports.NixFunInvocation = NixFunInvocation;
exports.NixAttrReference = NixAttrReference;
exports.NixWith = NixWith;
exports.NixInherit = NixInherit;
exports.NixInlineJS = NixInlineJS;
exports.NixImport = NixImport;
exports.NixStorePath = NixStorePath;
exports.NixAssert = NixAssert;
exports.NixIf = NixIf;

/* Generate operations */
exports.generateIndentation = generate.generateIndentation;
exports.objectMembersToAttrsMembers = generate.objectMembersToAttrsMembers;
exports.jsToIndentedNix = generate.jsToIndentedNix;
exports.jsToNix = generate.jsToNix;

/* Build operations */
exports.nixBuild = build.nixBuild;
exports.callNixBuild = build.callNixBuild;

/* Execute operations */
exports.convertToShellArg = execute.convertToShellArg;
exports.evaluateDerivation = execute.evaluateDerivation;
