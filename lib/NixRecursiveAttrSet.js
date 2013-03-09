/**
 * @class NixRecursiveAttrSet
 * @extends NixObject
 *
 * A recursive attribute set in which members can refer to each other.
 */
var inherit = require('./inherit.js').inherit;
var NixObject = require('./NixObject.js').NixObject;

/**
 * @constructor
 * Creates a new NixRecursiveAttrSet instance.
 *
 * @param {Object} value An aribitrary object that should be represented as a recursive attribute set. This object is stored as a reference.
 */
function NixRecursiveAttrSet(value) {
    NixObject.call(this, value);
}

inherit(NixObject, NixRecursiveAttrSet);

exports.NixRecursiveAttrSet = NixRecursiveAttrSet;
