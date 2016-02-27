/* */ 
var cloneArrayBuffer = require('./_cloneArrayBuffer');
function cloneTypedArray(typedArray, isDeep) {
  var arrayBuffer = typedArray.buffer,
      buffer = isDeep ? cloneArrayBuffer(arrayBuffer) : arrayBuffer,
      Ctor = typedArray.constructor;
  return new Ctor(buffer, typedArray.byteOffset, typedArray.length);
}
module.exports = cloneTypedArray;
