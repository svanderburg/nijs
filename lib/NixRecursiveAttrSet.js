/**
 * @class NixRecursiveAttrSet
 * @extends NixValue
 *
 * A recursive attribute set in which members can refer to each other.
 */
var inherit = require('./inherit.js').inherit;
var NixValue = require('./NixValue.js').NixValue;
var nijs = require('./nijs.js');

/**
 * @constructor
 * Creates a new NixRecursiveAttrSet instance.
 *
 * @param {Object} value An aribitrary object that should be represented as a recursive attribute set. This object is stored as a reference.
 */
function NixRecursiveAttrSet(value) {
    NixValue.call(this, value);
}

/* NixRecursiveAttrSet inherits from NixValue */
inherit(NixValue, NixRecursiveAttrSet);

/**
 * @see NixObject#toNixExpr
 */
NixRecursiveAttrSet.prototype.toNixExpr = function() {
    return "rec {\n" + nijs.objectMembersToAttrsMembers(this.value) + "\n}";
};

exports.NixRecursiveAttrSet = NixRecursiveAttrSet;
