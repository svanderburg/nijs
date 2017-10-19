var inherit = require('./util/inherit.js').inherit;
var NixValue = require('./NixValue.js').NixValue;
var nijs = require('../nijs.js');

/**
 * Creates a new NixRecursiveAttrSet instance.
 *
 * @class NixRecursiveAttrSet
 * @extends NixValue
 * @classdesc A recursive attribute set in which members can refer to each other.
 *
 * @constructor
 * @param {Object} value An arbitrary object that should be represented as a recursive attribute set. This object is stored as a reference.
 */
function NixRecursiveAttrSet(value) {
    NixValue.call(this, value);
}

/* NixRecursiveAttrSet inherits from NixValue */
inherit(NixValue, NixRecursiveAttrSet);

/**
 * @see NixObject#toNixExpr
 */
NixRecursiveAttrSet.prototype.toNixExpr = function(indentLevel, format) {
    if(Object.keys(this.value).length == 0) {
        return "rec {}";
    } else {
        return "rec {\n" +
            nijs.objectMembersToAttrsMembers(this.value, indentLevel + 1, format) +
            nijs.generateIndentation(indentLevel, format) + "}";
    }
};

exports.NixRecursiveAttrSet = NixRecursiveAttrSet;
