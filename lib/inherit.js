/**
 * @static @class inherit
 * Contains a crazy but working class inheritance simulation method.
 */
 
/**
 * @member inherit
 *
 * Do a simulated class inheritance using a function representing the
 * constructor of a base class and a function representing the constructor of
 * a child class. I could (of course) use yet another particular library to do
 * this, but this will also introduce another dependency on another package.
 * Therefore, I did it myself.
 *
 * I don't dislike the concept of prototypes, but the way it's implemented in
 * JavaScript is just too crazy. You have to do some crazy stuff to properly set
 * prototypes, as we cannot control them directly. Anyway, this function
 * abstracts over that burden so that we don't have to repeat this every time.
 *
 * @param {Function} parent Constructor function of the simulated parent class
 * @param {Function} child Constructor function of the simulated child class
 */

function inherit(parent, child) {
    function F() {}; /* Dummy constructor function used to create an empty object with a prototype containing the parent's class definition */
    F.prototype = parent.prototype; /* Assign the parent constructor function's prototype property (not the real prototype) to the dummy constructor function. */
    child.prototype = new F(); /* Create an instance of the dummy constructor. This call returns an empty object, which prototype contains the parent's class definition */
    child.prototype.constructor = child; /* Set the constructor to our child constructor function again, as it has been changed by the parent's prototype */
}

exports.inherit = inherit;
