/* */ 
var baseCreate = require('./_baseCreate'),
    isFunction = require('./isFunction'),
    isPrototype = require('./_isPrototype');
var getPrototypeOf = Object.getPrototypeOf;
function initCloneObject(object) {
  return (isFunction(object.constructor) && !isPrototype(object)) ? baseCreate(getPrototypeOf(object)) : {};
}
module.exports = initCloneObject;
