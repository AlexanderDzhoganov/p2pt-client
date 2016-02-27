/* */ 
var isFunction = require('./isFunction');
var objectProto = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (isFunction(Ctor) && Ctor.prototype) || objectProto;
  return value === proto;
}
module.exports = isPrototype;
