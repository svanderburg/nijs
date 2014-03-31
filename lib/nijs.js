/**
 * @static @class nijs
 * Contains functions that convert a CommonJS module declaring packages into Nix
 * expressions and a way to execute them.
 */

var execute = require('./execute');
var build = require('./build.js');

/* Prototypes */
var NixObject = require('./ast/NixObject.js').NixObject;
var NixValue = require('./ast/NixValue.js').NixValue;
var NixFile = require('./ast/NixFile.js').NixFile;
var NixURL = require('./ast/NixURL.js').NixURL;
var NixRecursiveAttrSet = require('./ast/NixRecursiveAttrSet.js').NixRecursiveAttrSet;
var NixLet = require('./ast/NixLet.js').NixLet;
var NixExpression = require('./ast/NixExpression.js').NixExpression;
var NixFunction = require('./ast/NixFunction.js').NixFunction;
var NixFunInvocation = require('./ast/NixFunInvocation.js').NixFunInvocation;
var NixWith = require('./ast/NixWith.js').NixWith;
var NixInlineJS = require('./ast/NixInlineJS.js').NixInlineJS;
var NixStorePath = require('./ast/NixStorePath.js').NixStorePath;

exports.NixObject = NixObject;
exports.NixValue = NixValue;
exports.NixFile = NixFile;
exports.NixURL = NixURL;
exports.NixRecursiveAttrSet = NixRecursiveAttrSet;
exports.NixLet = NixLet;
exports.NixExpression = NixExpression;
exports.NixFunction = NixFunction;
exports.NixFunInvocation = NixFunInvocation;
exports.NixWith = NixWith;
exports.NixInlineJS = NixInlineJS;
exports.NixStorePath = NixStorePath;

/* Build operations */
exports.objectMembersToAttrsMembers = build.objectMembersToAttrsMembers;
exports.jsToNix = build.jsToNix;
exports.nixBuild = build.nixBuild;
exports.callNixBuild = build.callNixBuild;

/* Execute operations */
exports.convertToShellArg = execute.convertToShellArg;
exports.evaluateDerivation = execute.evaluateDerivation;
