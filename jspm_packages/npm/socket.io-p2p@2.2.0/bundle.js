/* */ 
"format cjs";
(function(Buffer, process) {
  (function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = f();
    } else if (typeof define === "function" && define.amd) {
      define([], f);
    } else {
      var g;
      if (typeof window !== "undefined") {
        g = window;
      } else if (typeof global !== "undefined") {
        g = global;
      } else if (typeof self !== "undefined") {
        g = self;
      } else {
        g = this;
      }
      g.P2P = f();
    }
  })(function() {
    var define,
        module,
        exports;
    return (function e(t, n, r) {
      function s(o, u) {
        if (!n[o]) {
          if (!t[o]) {
            var a = typeof require == "function" && require;
            if (!u && a)
              return a(o, !0);
            if (i)
              return i(o, !0);
            var f = new Error("Cannot find module '" + o + "'");
            throw f.code = "MODULE_NOT_FOUND", f;
          }
          var l = n[o] = {exports: {}};
          t[o][0].call(l.exports, function(e) {
            var n = t[o][1][e];
            return s(n ? n : e);
          }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
      }
      var i = typeof require == "function" && require;
      for (var o = 0; o < r.length; o++)
        s(r[o]);
      return s;
    })({
      1: [function(require, module, exports) {}, {}],
      2: [function(require, module, exports) {
        var base64 = require('base64-js');
        var ieee754 = require('ieee754');
        var isArray = require('is-array');
        exports.Buffer = Buffer;
        exports.SlowBuffer = SlowBuffer;
        exports.INSPECT_MAX_BYTES = 50;
        Buffer.poolSize = 8192;
        var kMaxLength = 0x3fffffff;
        var rootParent = {};
        Buffer.TYPED_ARRAY_SUPPORT = (function() {
          try {
            var buf = new ArrayBuffer(0);
            var arr = new Uint8Array(buf);
            arr.foo = function() {
              return 42;
            };
            return arr.foo() === 42 && typeof arr.subarray === 'function' && new Uint8Array(1).subarray(1, 1).byteLength === 0;
          } catch (e) {
            return false;
          }
        })();
        function Buffer(subject, encoding, noZero) {
          if (!(this instanceof Buffer))
            return new Buffer(subject, encoding, noZero);
          var type = typeof subject;
          var length;
          if (type === 'number') {
            length = +subject;
          } else if (type === 'string') {
            length = Buffer.byteLength(subject, encoding);
          } else if (type === 'object' && subject !== null) {
            if (subject.type === 'Buffer' && isArray(subject.data))
              subject = subject.data;
            length = +subject.length;
          } else {
            throw new TypeError('must start with number, buffer, array or string');
          }
          if (length > kMaxLength)
            throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength.toString(16) + ' bytes');
          if (length < 0)
            length = 0;
          else
            length >>>= 0;
          var self = this;
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            self = Buffer._augment(new Uint8Array(length));
          } else {
            self.length = length;
            self._isBuffer = true;
          }
          var i;
          if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
            self._set(subject);
          } else if (isArrayish(subject)) {
            if (Buffer.isBuffer(subject)) {
              for (i = 0; i < length; i++)
                self[i] = subject.readUInt8(i);
            } else {
              for (i = 0; i < length; i++)
                self[i] = ((subject[i] % 256) + 256) % 256;
            }
          } else if (type === 'string') {
            self.write(subject, 0, encoding);
          } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT && !noZero) {
            for (i = 0; i < length; i++) {
              self[i] = 0;
            }
          }
          if (length > 0 && length <= Buffer.poolSize)
            self.parent = rootParent;
          return self;
        }
        function SlowBuffer(subject, encoding, noZero) {
          if (!(this instanceof SlowBuffer))
            return new SlowBuffer(subject, encoding, noZero);
          var buf = new Buffer(subject, encoding, noZero);
          delete buf.parent;
          return buf;
        }
        Buffer.isBuffer = function(b) {
          return !!(b != null && b._isBuffer);
        };
        Buffer.compare = function(a, b) {
          if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b))
            throw new TypeError('Arguments must be Buffers');
          if (a === b)
            return 0;
          var x = a.length;
          var y = b.length;
          for (var i = 0,
              len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
          if (i !== len) {
            x = a[i];
            y = b[i];
          }
          if (x < y)
            return -1;
          if (y < x)
            return 1;
          return 0;
        };
        Buffer.isEncoding = function(encoding) {
          switch (String(encoding).toLowerCase()) {
            case 'hex':
            case 'utf8':
            case 'utf-8':
            case 'ascii':
            case 'binary':
            case 'base64':
            case 'raw':
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              return true;
            default:
              return false;
          }
        };
        Buffer.concat = function(list, totalLength) {
          if (!isArray(list))
            throw new TypeError('Usage: Buffer.concat(list[, length])');
          if (list.length === 0) {
            return new Buffer(0);
          } else if (list.length === 1) {
            return list[0];
          }
          var i;
          if (totalLength === undefined) {
            totalLength = 0;
            for (i = 0; i < list.length; i++) {
              totalLength += list[i].length;
            }
          }
          var buf = new Buffer(totalLength);
          var pos = 0;
          for (i = 0; i < list.length; i++) {
            var item = list[i];
            item.copy(buf, pos);
            pos += item.length;
          }
          return buf;
        };
        Buffer.byteLength = function(str, encoding) {
          var ret;
          str = str + '';
          switch (encoding || 'utf8') {
            case 'ascii':
            case 'binary':
            case 'raw':
              ret = str.length;
              break;
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              ret = str.length * 2;
              break;
            case 'hex':
              ret = str.length >>> 1;
              break;
            case 'utf8':
            case 'utf-8':
              ret = utf8ToBytes(str).length;
              break;
            case 'base64':
              ret = base64ToBytes(str).length;
              break;
            default:
              ret = str.length;
          }
          return ret;
        };
        Buffer.prototype.length = undefined;
        Buffer.prototype.parent = undefined;
        Buffer.prototype.toString = function(encoding, start, end) {
          var loweredCase = false;
          start = start >>> 0;
          end = end === undefined || end === Infinity ? this.length : end >>> 0;
          if (!encoding)
            encoding = 'utf8';
          if (start < 0)
            start = 0;
          if (end > this.length)
            end = this.length;
          if (end <= start)
            return '';
          while (true) {
            switch (encoding) {
              case 'hex':
                return hexSlice(this, start, end);
              case 'utf8':
              case 'utf-8':
                return utf8Slice(this, start, end);
              case 'ascii':
                return asciiSlice(this, start, end);
              case 'binary':
                return binarySlice(this, start, end);
              case 'base64':
                return base64Slice(this, start, end);
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return utf16leSlice(this, start, end);
              default:
                if (loweredCase)
                  throw new TypeError('Unknown encoding: ' + encoding);
                encoding = (encoding + '').toLowerCase();
                loweredCase = true;
            }
          }
        };
        Buffer.prototype.equals = function(b) {
          if (!Buffer.isBuffer(b))
            throw new TypeError('Argument must be a Buffer');
          if (this === b)
            return true;
          return Buffer.compare(this, b) === 0;
        };
        Buffer.prototype.inspect = function() {
          var str = '';
          var max = exports.INSPECT_MAX_BYTES;
          if (this.length > 0) {
            str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
            if (this.length > max)
              str += ' ... ';
          }
          return '<Buffer ' + str + '>';
        };
        Buffer.prototype.compare = function(b) {
          if (!Buffer.isBuffer(b))
            throw new TypeError('Argument must be a Buffer');
          if (this === b)
            return 0;
          return Buffer.compare(this, b);
        };
        Buffer.prototype.get = function(offset) {
          console.log('.get() is deprecated. Access using array indexes instead.');
          return this.readUInt8(offset);
        };
        Buffer.prototype.set = function(v, offset) {
          console.log('.set() is deprecated. Access using array indexes instead.');
          return this.writeUInt8(v, offset);
        };
        function hexWrite(buf, string, offset, length) {
          offset = Number(offset) || 0;
          var remaining = buf.length - offset;
          if (!length) {
            length = remaining;
          } else {
            length = Number(length);
            if (length > remaining) {
              length = remaining;
            }
          }
          var strLen = string.length;
          if (strLen % 2 !== 0)
            throw new Error('Invalid hex string');
          if (length > strLen / 2) {
            length = strLen / 2;
          }
          for (var i = 0; i < length; i++) {
            var byte = parseInt(string.substr(i * 2, 2), 16);
            if (isNaN(byte))
              throw new Error('Invalid hex string');
            buf[offset + i] = byte;
          }
          return i;
        }
        function utf8Write(buf, string, offset, length) {
          var charsWritten = blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
          return charsWritten;
        }
        function asciiWrite(buf, string, offset, length) {
          var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length);
          return charsWritten;
        }
        function binaryWrite(buf, string, offset, length) {
          return asciiWrite(buf, string, offset, length);
        }
        function base64Write(buf, string, offset, length) {
          var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length);
          return charsWritten;
        }
        function utf16leWrite(buf, string, offset, length) {
          var charsWritten = blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
          return charsWritten;
        }
        Buffer.prototype.write = function(string, offset, length, encoding) {
          if (isFinite(offset)) {
            if (!isFinite(length)) {
              encoding = length;
              length = undefined;
            }
          } else {
            var swap = encoding;
            encoding = offset;
            offset = length;
            length = swap;
          }
          offset = Number(offset) || 0;
          if (length < 0 || offset < 0 || offset > this.length)
            throw new RangeError('attempt to write outside buffer bounds');
          var remaining = this.length - offset;
          if (!length) {
            length = remaining;
          } else {
            length = Number(length);
            if (length > remaining) {
              length = remaining;
            }
          }
          encoding = String(encoding || 'utf8').toLowerCase();
          var ret;
          switch (encoding) {
            case 'hex':
              ret = hexWrite(this, string, offset, length);
              break;
            case 'utf8':
            case 'utf-8':
              ret = utf8Write(this, string, offset, length);
              break;
            case 'ascii':
              ret = asciiWrite(this, string, offset, length);
              break;
            case 'binary':
              ret = binaryWrite(this, string, offset, length);
              break;
            case 'base64':
              ret = base64Write(this, string, offset, length);
              break;
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
              ret = utf16leWrite(this, string, offset, length);
              break;
            default:
              throw new TypeError('Unknown encoding: ' + encoding);
          }
          return ret;
        };
        Buffer.prototype.toJSON = function() {
          return {
            type: 'Buffer',
            data: Array.prototype.slice.call(this._arr || this, 0)
          };
        };
        function base64Slice(buf, start, end) {
          if (start === 0 && end === buf.length) {
            return base64.fromByteArray(buf);
          } else {
            return base64.fromByteArray(buf.slice(start, end));
          }
        }
        function utf8Slice(buf, start, end) {
          var res = '';
          var tmp = '';
          end = Math.min(buf.length, end);
          for (var i = start; i < end; i++) {
            if (buf[i] <= 0x7F) {
              res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i]);
              tmp = '';
            } else {
              tmp += '%' + buf[i].toString(16);
            }
          }
          return res + decodeUtf8Char(tmp);
        }
        function asciiSlice(buf, start, end) {
          var ret = '';
          end = Math.min(buf.length, end);
          for (var i = start; i < end; i++) {
            ret += String.fromCharCode(buf[i] & 0x7F);
          }
          return ret;
        }
        function binarySlice(buf, start, end) {
          var ret = '';
          end = Math.min(buf.length, end);
          for (var i = start; i < end; i++) {
            ret += String.fromCharCode(buf[i]);
          }
          return ret;
        }
        function hexSlice(buf, start, end) {
          var len = buf.length;
          if (!start || start < 0)
            start = 0;
          if (!end || end < 0 || end > len)
            end = len;
          var out = '';
          for (var i = start; i < end; i++) {
            out += toHex(buf[i]);
          }
          return out;
        }
        function utf16leSlice(buf, start, end) {
          var bytes = buf.slice(start, end);
          var res = '';
          for (var i = 0; i < bytes.length; i += 2) {
            res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
          }
          return res;
        }
        Buffer.prototype.slice = function(start, end) {
          var len = this.length;
          start = ~~start;
          end = end === undefined ? len : ~~end;
          if (start < 0) {
            start += len;
            if (start < 0)
              start = 0;
          } else if (start > len) {
            start = len;
          }
          if (end < 0) {
            end += len;
            if (end < 0)
              end = 0;
          } else if (end > len) {
            end = len;
          }
          if (end < start)
            end = start;
          var newBuf;
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            newBuf = Buffer._augment(this.subarray(start, end));
          } else {
            var sliceLen = end - start;
            newBuf = new Buffer(sliceLen, undefined, true);
            for (var i = 0; i < sliceLen; i++) {
              newBuf[i] = this[i + start];
            }
          }
          if (newBuf.length)
            newBuf.parent = this.parent || this;
          return newBuf;
        };
        function checkOffset(offset, ext, length) {
          if ((offset % 1) !== 0 || offset < 0)
            throw new RangeError('offset is not uint');
          if (offset + ext > length)
            throw new RangeError('Trying to access beyond buffer length');
        }
        Buffer.prototype.readUIntLE = function(offset, byteLength, noAssert) {
          offset = offset >>> 0;
          byteLength = byteLength >>> 0;
          if (!noAssert)
            checkOffset(offset, byteLength, this.length);
          var val = this[offset];
          var mul = 1;
          var i = 0;
          while (++i < byteLength && (mul *= 0x100))
            val += this[offset + i] * mul;
          return val;
        };
        Buffer.prototype.readUIntBE = function(offset, byteLength, noAssert) {
          offset = offset >>> 0;
          byteLength = byteLength >>> 0;
          if (!noAssert)
            checkOffset(offset, byteLength, this.length);
          var val = this[offset + --byteLength];
          var mul = 1;
          while (byteLength > 0 && (mul *= 0x100))
            val += this[offset + --byteLength] * mul;
          return val;
        };
        Buffer.prototype.readUInt8 = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 1, this.length);
          return this[offset];
        };
        Buffer.prototype.readUInt16LE = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 2, this.length);
          return this[offset] | (this[offset + 1] << 8);
        };
        Buffer.prototype.readUInt16BE = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 2, this.length);
          return (this[offset] << 8) | this[offset + 1];
        };
        Buffer.prototype.readUInt32LE = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 4, this.length);
          return ((this[offset]) | (this[offset + 1] << 8) | (this[offset + 2] << 16)) + (this[offset + 3] * 0x1000000);
        };
        Buffer.prototype.readUInt32BE = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 4, this.length);
          return (this[offset] * 0x1000000) + ((this[offset + 1] << 16) | (this[offset + 2] << 8) | this[offset + 3]);
        };
        Buffer.prototype.readIntLE = function(offset, byteLength, noAssert) {
          offset = offset >>> 0;
          byteLength = byteLength >>> 0;
          if (!noAssert)
            checkOffset(offset, byteLength, this.length);
          var val = this[offset];
          var mul = 1;
          var i = 0;
          while (++i < byteLength && (mul *= 0x100))
            val += this[offset + i] * mul;
          mul *= 0x80;
          if (val >= mul)
            val -= Math.pow(2, 8 * byteLength);
          return val;
        };
        Buffer.prototype.readIntBE = function(offset, byteLength, noAssert) {
          offset = offset >>> 0;
          byteLength = byteLength >>> 0;
          if (!noAssert)
            checkOffset(offset, byteLength, this.length);
          var i = byteLength;
          var mul = 1;
          var val = this[offset + --i];
          while (i > 0 && (mul *= 0x100))
            val += this[offset + --i] * mul;
          mul *= 0x80;
          if (val >= mul)
            val -= Math.pow(2, 8 * byteLength);
          return val;
        };
        Buffer.prototype.readInt8 = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 1, this.length);
          if (!(this[offset] & 0x80))
            return (this[offset]);
          return ((0xff - this[offset] + 1) * -1);
        };
        Buffer.prototype.readInt16LE = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 2, this.length);
          var val = this[offset] | (this[offset + 1] << 8);
          return (val & 0x8000) ? val | 0xFFFF0000 : val;
        };
        Buffer.prototype.readInt16BE = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 2, this.length);
          var val = this[offset + 1] | (this[offset] << 8);
          return (val & 0x8000) ? val | 0xFFFF0000 : val;
        };
        Buffer.prototype.readInt32LE = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 4, this.length);
          return (this[offset]) | (this[offset + 1] << 8) | (this[offset + 2] << 16) | (this[offset + 3] << 24);
        };
        Buffer.prototype.readInt32BE = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 4, this.length);
          return (this[offset] << 24) | (this[offset + 1] << 16) | (this[offset + 2] << 8) | (this[offset + 3]);
        };
        Buffer.prototype.readFloatLE = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 4, this.length);
          return ieee754.read(this, offset, true, 23, 4);
        };
        Buffer.prototype.readFloatBE = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 4, this.length);
          return ieee754.read(this, offset, false, 23, 4);
        };
        Buffer.prototype.readDoubleLE = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 8, this.length);
          return ieee754.read(this, offset, true, 52, 8);
        };
        Buffer.prototype.readDoubleBE = function(offset, noAssert) {
          if (!noAssert)
            checkOffset(offset, 8, this.length);
          return ieee754.read(this, offset, false, 52, 8);
        };
        function checkInt(buf, value, offset, ext, max, min) {
          if (!Buffer.isBuffer(buf))
            throw new TypeError('buffer must be a Buffer instance');
          if (value > max || value < min)
            throw new RangeError('value is out of bounds');
          if (offset + ext > buf.length)
            throw new RangeError('index out of range');
        }
        Buffer.prototype.writeUIntLE = function(value, offset, byteLength, noAssert) {
          value = +value;
          offset = offset >>> 0;
          byteLength = byteLength >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);
          var mul = 1;
          var i = 0;
          this[offset] = value & 0xFF;
          while (++i < byteLength && (mul *= 0x100))
            this[offset + i] = (value / mul) >>> 0 & 0xFF;
          return offset + byteLength;
        };
        Buffer.prototype.writeUIntBE = function(value, offset, byteLength, noAssert) {
          value = +value;
          offset = offset >>> 0;
          byteLength = byteLength >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);
          var i = byteLength - 1;
          var mul = 1;
          this[offset + i] = value & 0xFF;
          while (--i >= 0 && (mul *= 0x100))
            this[offset + i] = (value / mul) >>> 0 & 0xFF;
          return offset + byteLength;
        };
        Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 1, 0xff, 0);
          if (!Buffer.TYPED_ARRAY_SUPPORT)
            value = Math.floor(value);
          this[offset] = value;
          return offset + 1;
        };
        function objectWriteUInt16(buf, value, offset, littleEndian) {
          if (value < 0)
            value = 0xffff + value + 1;
          for (var i = 0,
              j = Math.min(buf.length - offset, 2); i < j; i++) {
            buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>> (littleEndian ? i : 1 - i) * 8;
          }
        }
        Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 2, 0xffff, 0);
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = value;
            this[offset + 1] = (value >>> 8);
          } else
            objectWriteUInt16(this, value, offset, true);
          return offset + 2;
        };
        Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 2, 0xffff, 0);
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value >>> 8);
            this[offset + 1] = value;
          } else
            objectWriteUInt16(this, value, offset, false);
          return offset + 2;
        };
        function objectWriteUInt32(buf, value, offset, littleEndian) {
          if (value < 0)
            value = 0xffffffff + value + 1;
          for (var i = 0,
              j = Math.min(buf.length - offset, 4); i < j; i++) {
            buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
          }
        }
        Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 4, 0xffffffff, 0);
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset + 3] = (value >>> 24);
            this[offset + 2] = (value >>> 16);
            this[offset + 1] = (value >>> 8);
            this[offset] = value;
          } else
            objectWriteUInt32(this, value, offset, true);
          return offset + 4;
        };
        Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 4, 0xffffffff, 0);
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value >>> 24);
            this[offset + 1] = (value >>> 16);
            this[offset + 2] = (value >>> 8);
            this[offset + 3] = value;
          } else
            objectWriteUInt32(this, value, offset, false);
          return offset + 4;
        };
        Buffer.prototype.writeIntLE = function(value, offset, byteLength, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert) {
            checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength - 1) - 1, -Math.pow(2, 8 * byteLength - 1));
          }
          var i = 0;
          var mul = 1;
          var sub = value < 0 ? 1 : 0;
          this[offset] = value & 0xFF;
          while (++i < byteLength && (mul *= 0x100))
            this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
          return offset + byteLength;
        };
        Buffer.prototype.writeIntBE = function(value, offset, byteLength, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert) {
            checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength - 1) - 1, -Math.pow(2, 8 * byteLength - 1));
          }
          var i = byteLength - 1;
          var mul = 1;
          var sub = value < 0 ? 1 : 0;
          this[offset + i] = value & 0xFF;
          while (--i >= 0 && (mul *= 0x100))
            this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
          return offset + byteLength;
        };
        Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 1, 0x7f, -0x80);
          if (!Buffer.TYPED_ARRAY_SUPPORT)
            value = Math.floor(value);
          if (value < 0)
            value = 0xff + value + 1;
          this[offset] = value;
          return offset + 1;
        };
        Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 2, 0x7fff, -0x8000);
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = value;
            this[offset + 1] = (value >>> 8);
          } else
            objectWriteUInt16(this, value, offset, true);
          return offset + 2;
        };
        Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 2, 0x7fff, -0x8000);
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value >>> 8);
            this[offset + 1] = value;
          } else
            objectWriteUInt16(this, value, offset, false);
          return offset + 2;
        };
        Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = value;
            this[offset + 1] = (value >>> 8);
            this[offset + 2] = (value >>> 16);
            this[offset + 3] = (value >>> 24);
          } else
            objectWriteUInt32(this, value, offset, true);
          return offset + 4;
        };
        Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
          value = +value;
          offset = offset >>> 0;
          if (!noAssert)
            checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
          if (value < 0)
            value = 0xffffffff + value + 1;
          if (Buffer.TYPED_ARRAY_SUPPORT) {
            this[offset] = (value >>> 24);
            this[offset + 1] = (value >>> 16);
            this[offset + 2] = (value >>> 8);
            this[offset + 3] = value;
          } else
            objectWriteUInt32(this, value, offset, false);
          return offset + 4;
        };
        function checkIEEE754(buf, value, offset, ext, max, min) {
          if (value > max || value < min)
            throw new RangeError('value is out of bounds');
          if (offset + ext > buf.length)
            throw new RangeError('index out of range');
          if (offset < 0)
            throw new RangeError('index out of range');
        }
        function writeFloat(buf, value, offset, littleEndian, noAssert) {
          if (!noAssert)
            checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
          ieee754.write(buf, value, offset, littleEndian, 23, 4);
          return offset + 4;
        }
        Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
          return writeFloat(this, value, offset, true, noAssert);
        };
        Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
          return writeFloat(this, value, offset, false, noAssert);
        };
        function writeDouble(buf, value, offset, littleEndian, noAssert) {
          if (!noAssert)
            checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
          ieee754.write(buf, value, offset, littleEndian, 52, 8);
          return offset + 8;
        }
        Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
          return writeDouble(this, value, offset, true, noAssert);
        };
        Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
          return writeDouble(this, value, offset, false, noAssert);
        };
        Buffer.prototype.copy = function(target, target_start, start, end) {
          var self = this;
          if (!start)
            start = 0;
          if (!end && end !== 0)
            end = this.length;
          if (target_start >= target.length)
            target_start = target.length;
          if (!target_start)
            target_start = 0;
          if (end > 0 && end < start)
            end = start;
          if (end === start)
            return 0;
          if (target.length === 0 || self.length === 0)
            return 0;
          if (target_start < 0)
            throw new RangeError('targetStart out of bounds');
          if (start < 0 || start >= self.length)
            throw new RangeError('sourceStart out of bounds');
          if (end < 0)
            throw new RangeError('sourceEnd out of bounds');
          if (end > this.length)
            end = this.length;
          if (target.length - target_start < end - start)
            end = target.length - target_start + start;
          var len = end - start;
          if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
            for (var i = 0; i < len; i++) {
              target[i + target_start] = this[i + start];
            }
          } else {
            target._set(this.subarray(start, start + len), target_start);
          }
          return len;
        };
        Buffer.prototype.fill = function(value, start, end) {
          if (!value)
            value = 0;
          if (!start)
            start = 0;
          if (!end)
            end = this.length;
          if (end < start)
            throw new RangeError('end < start');
          if (end === start)
            return;
          if (this.length === 0)
            return;
          if (start < 0 || start >= this.length)
            throw new RangeError('start out of bounds');
          if (end < 0 || end > this.length)
            throw new RangeError('end out of bounds');
          var i;
          if (typeof value === 'number') {
            for (i = start; i < end; i++) {
              this[i] = value;
            }
          } else {
            var bytes = utf8ToBytes(value.toString());
            var len = bytes.length;
            for (i = start; i < end; i++) {
              this[i] = bytes[i % len];
            }
          }
          return this;
        };
        Buffer.prototype.toArrayBuffer = function() {
          if (typeof Uint8Array !== 'undefined') {
            if (Buffer.TYPED_ARRAY_SUPPORT) {
              return (new Buffer(this)).buffer;
            } else {
              var buf = new Uint8Array(this.length);
              for (var i = 0,
                  len = buf.length; i < len; i += 1) {
                buf[i] = this[i];
              }
              return buf.buffer;
            }
          } else {
            throw new TypeError('Buffer.toArrayBuffer not supported in this browser');
          }
        };
        var BP = Buffer.prototype;
        Buffer._augment = function(arr) {
          arr.constructor = Buffer;
          arr._isBuffer = true;
          arr._get = arr.get;
          arr._set = arr.set;
          arr.get = BP.get;
          arr.set = BP.set;
          arr.write = BP.write;
          arr.toString = BP.toString;
          arr.toLocaleString = BP.toString;
          arr.toJSON = BP.toJSON;
          arr.equals = BP.equals;
          arr.compare = BP.compare;
          arr.copy = BP.copy;
          arr.slice = BP.slice;
          arr.readUIntLE = BP.readUIntLE;
          arr.readUIntBE = BP.readUIntBE;
          arr.readUInt8 = BP.readUInt8;
          arr.readUInt16LE = BP.readUInt16LE;
          arr.readUInt16BE = BP.readUInt16BE;
          arr.readUInt32LE = BP.readUInt32LE;
          arr.readUInt32BE = BP.readUInt32BE;
          arr.readIntLE = BP.readIntLE;
          arr.readIntBE = BP.readIntBE;
          arr.readInt8 = BP.readInt8;
          arr.readInt16LE = BP.readInt16LE;
          arr.readInt16BE = BP.readInt16BE;
          arr.readInt32LE = BP.readInt32LE;
          arr.readInt32BE = BP.readInt32BE;
          arr.readFloatLE = BP.readFloatLE;
          arr.readFloatBE = BP.readFloatBE;
          arr.readDoubleLE = BP.readDoubleLE;
          arr.readDoubleBE = BP.readDoubleBE;
          arr.writeUInt8 = BP.writeUInt8;
          arr.writeUIntLE = BP.writeUIntLE;
          arr.writeUIntBE = BP.writeUIntBE;
          arr.writeUInt16LE = BP.writeUInt16LE;
          arr.writeUInt16BE = BP.writeUInt16BE;
          arr.writeUInt32LE = BP.writeUInt32LE;
          arr.writeUInt32BE = BP.writeUInt32BE;
          arr.writeIntLE = BP.writeIntLE;
          arr.writeIntBE = BP.writeIntBE;
          arr.writeInt8 = BP.writeInt8;
          arr.writeInt16LE = BP.writeInt16LE;
          arr.writeInt16BE = BP.writeInt16BE;
          arr.writeInt32LE = BP.writeInt32LE;
          arr.writeInt32BE = BP.writeInt32BE;
          arr.writeFloatLE = BP.writeFloatLE;
          arr.writeFloatBE = BP.writeFloatBE;
          arr.writeDoubleLE = BP.writeDoubleLE;
          arr.writeDoubleBE = BP.writeDoubleBE;
          arr.fill = BP.fill;
          arr.inspect = BP.inspect;
          arr.toArrayBuffer = BP.toArrayBuffer;
          return arr;
        };
        var INVALID_BASE64_RE = /[^+\/0-9A-z\-]/g;
        function base64clean(str) {
          str = stringtrim(str).replace(INVALID_BASE64_RE, '');
          if (str.length < 2)
            return '';
          while (str.length % 4 !== 0) {
            str = str + '=';
          }
          return str;
        }
        function stringtrim(str) {
          if (str.trim)
            return str.trim();
          return str.replace(/^\s+|\s+$/g, '');
        }
        function isArrayish(subject) {
          return isArray(subject) || Buffer.isBuffer(subject) || subject && typeof subject === 'object' && typeof subject.length === 'number';
        }
        function toHex(n) {
          if (n < 16)
            return '0' + n.toString(16);
          return n.toString(16);
        }
        function utf8ToBytes(string, units) {
          units = units || Infinity;
          var codePoint;
          var length = string.length;
          var leadSurrogate = null;
          var bytes = [];
          var i = 0;
          for (; i < length; i++) {
            codePoint = string.charCodeAt(i);
            if (codePoint > 0xD7FF && codePoint < 0xE000) {
              if (leadSurrogate) {
                if (codePoint < 0xDC00) {
                  if ((units -= 3) > -1)
                    bytes.push(0xEF, 0xBF, 0xBD);
                  leadSurrogate = codePoint;
                  continue;
                } else {
                  codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000;
                  leadSurrogate = null;
                }
              } else {
                if (codePoint > 0xDBFF) {
                  if ((units -= 3) > -1)
                    bytes.push(0xEF, 0xBF, 0xBD);
                  continue;
                } else if (i + 1 === length) {
                  if ((units -= 3) > -1)
                    bytes.push(0xEF, 0xBF, 0xBD);
                  continue;
                } else {
                  leadSurrogate = codePoint;
                  continue;
                }
              }
            } else if (leadSurrogate) {
              if ((units -= 3) > -1)
                bytes.push(0xEF, 0xBF, 0xBD);
              leadSurrogate = null;
            }
            if (codePoint < 0x80) {
              if ((units -= 1) < 0)
                break;
              bytes.push(codePoint);
            } else if (codePoint < 0x800) {
              if ((units -= 2) < 0)
                break;
              bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
            } else if (codePoint < 0x10000) {
              if ((units -= 3) < 0)
                break;
              bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
            } else if (codePoint < 0x200000) {
              if ((units -= 4) < 0)
                break;
              bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
            } else {
              throw new Error('Invalid code point');
            }
          }
          return bytes;
        }
        function asciiToBytes(str) {
          var byteArray = [];
          for (var i = 0; i < str.length; i++) {
            byteArray.push(str.charCodeAt(i) & 0xFF);
          }
          return byteArray;
        }
        function utf16leToBytes(str, units) {
          var c,
              hi,
              lo;
          var byteArray = [];
          for (var i = 0; i < str.length; i++) {
            if ((units -= 2) < 0)
              break;
            c = str.charCodeAt(i);
            hi = c >> 8;
            lo = c % 256;
            byteArray.push(lo);
            byteArray.push(hi);
          }
          return byteArray;
        }
        function base64ToBytes(str) {
          return base64.toByteArray(base64clean(str));
        }
        function blitBuffer(src, dst, offset, length) {
          for (var i = 0; i < length; i++) {
            if ((i + offset >= dst.length) || (i >= src.length))
              break;
            dst[i + offset] = src[i];
          }
          return i;
        }
        function decodeUtf8Char(str) {
          try {
            return decodeURIComponent(str);
          } catch (err) {
            return String.fromCharCode(0xFFFD);
          }
        }
      }, {
        "base64-js": 3,
        "ieee754": 4,
        "is-array": 5
      }],
      3: [function(require, module, exports) {
        var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        ;
        (function(exports) {
          'use strict';
          var Arr = (typeof Uint8Array !== 'undefined') ? Uint8Array : Array;
          var PLUS = '+'.charCodeAt(0);
          var SLASH = '/'.charCodeAt(0);
          var NUMBER = '0'.charCodeAt(0);
          var LOWER = 'a'.charCodeAt(0);
          var UPPER = 'A'.charCodeAt(0);
          var PLUS_URL_SAFE = '-'.charCodeAt(0);
          var SLASH_URL_SAFE = '_'.charCodeAt(0);
          function decode(elt) {
            var code = elt.charCodeAt(0);
            if (code === PLUS || code === PLUS_URL_SAFE)
              return 62;
            if (code === SLASH || code === SLASH_URL_SAFE)
              return 63;
            if (code < NUMBER)
              return -1;
            if (code < NUMBER + 10)
              return code - NUMBER + 26 + 26;
            if (code < UPPER + 26)
              return code - UPPER;
            if (code < LOWER + 26)
              return code - LOWER + 26;
          }
          function b64ToByteArray(b64) {
            var i,
                j,
                l,
                tmp,
                placeHolders,
                arr;
            if (b64.length % 4 > 0) {
              throw new Error('Invalid string. Length must be a multiple of 4');
            }
            var len = b64.length;
            placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;
            arr = new Arr(b64.length * 3 / 4 - placeHolders);
            l = placeHolders > 0 ? b64.length - 4 : b64.length;
            var L = 0;
            function push(v) {
              arr[L++] = v;
            }
            for (i = 0, j = 0; i < l; i += 4, j += 3) {
              tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3));
              push((tmp & 0xFF0000) >> 16);
              push((tmp & 0xFF00) >> 8);
              push(tmp & 0xFF);
            }
            if (placeHolders === 2) {
              tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4);
              push(tmp & 0xFF);
            } else if (placeHolders === 1) {
              tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2);
              push((tmp >> 8) & 0xFF);
              push(tmp & 0xFF);
            }
            return arr;
          }
          function uint8ToBase64(uint8) {
            var i,
                extraBytes = uint8.length % 3,
                output = "",
                temp,
                length;
            function encode(num) {
              return lookup.charAt(num);
            }
            function tripletToBase64(num) {
              return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F);
            }
            for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
              temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
              output += tripletToBase64(temp);
            }
            switch (extraBytes) {
              case 1:
                temp = uint8[uint8.length - 1];
                output += encode(temp >> 2);
                output += encode((temp << 4) & 0x3F);
                output += '==';
                break;
              case 2:
                temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
                output += encode(temp >> 10);
                output += encode((temp >> 4) & 0x3F);
                output += encode((temp << 2) & 0x3F);
                output += '=';
                break;
            }
            return output;
          }
          exports.toByteArray = b64ToByteArray;
          exports.fromByteArray = uint8ToBase64;
        }(typeof exports === 'undefined' ? (this.base64js = {}) : exports));
      }, {}],
      4: [function(require, module, exports) {
        exports.read = function(buffer, offset, isLE, mLen, nBytes) {
          var e,
              m,
              eLen = nBytes * 8 - mLen - 1,
              eMax = (1 << eLen) - 1,
              eBias = eMax >> 1,
              nBits = -7,
              i = isLE ? (nBytes - 1) : 0,
              d = isLE ? -1 : 1,
              s = buffer[offset + i];
          i += d;
          e = s & ((1 << (-nBits)) - 1);
          s >>= (-nBits);
          nBits += eLen;
          for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8)
            ;
          m = e & ((1 << (-nBits)) - 1);
          e >>= (-nBits);
          nBits += mLen;
          for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8)
            ;
          if (e === 0) {
            e = 1 - eBias;
          } else if (e === eMax) {
            return m ? NaN : ((s ? -1 : 1) * Infinity);
          } else {
            m = m + Math.pow(2, mLen);
            e = e - eBias;
          }
          return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
        };
        exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
          var e,
              m,
              c,
              eLen = nBytes * 8 - mLen - 1,
              eMax = (1 << eLen) - 1,
              eBias = eMax >> 1,
              rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
              i = isLE ? 0 : (nBytes - 1),
              d = isLE ? 1 : -1,
              s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;
          value = Math.abs(value);
          if (isNaN(value) || value === Infinity) {
            m = isNaN(value) ? 1 : 0;
            e = eMax;
          } else {
            e = Math.floor(Math.log(value) / Math.LN2);
            if (value * (c = Math.pow(2, -e)) < 1) {
              e--;
              c *= 2;
            }
            if (e + eBias >= 1) {
              value += rt / c;
            } else {
              value += rt * Math.pow(2, 1 - eBias);
            }
            if (value * c >= 2) {
              e++;
              c /= 2;
            }
            if (e + eBias >= eMax) {
              m = 0;
              e = eMax;
            } else if (e + eBias >= 1) {
              m = (value * c - 1) * Math.pow(2, mLen);
              e = e + eBias;
            } else {
              m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
              e = 0;
            }
          }
          for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8)
            ;
          e = (e << mLen) | m;
          eLen += mLen;
          for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8)
            ;
          buffer[offset + i - d] |= s * 128;
        };
      }, {}],
      5: [function(require, module, exports) {
        var isArray = Array.isArray;
        var str = Object.prototype.toString;
        module.exports = isArray || function(val) {
          return !!val && '[object Array]' == str.call(val);
        };
      }, {}],
      6: [function(require, module, exports) {
        function EventEmitter() {
          this._events = this._events || {};
          this._maxListeners = this._maxListeners || undefined;
        }
        module.exports = EventEmitter;
        EventEmitter.EventEmitter = EventEmitter;
        EventEmitter.prototype._events = undefined;
        EventEmitter.prototype._maxListeners = undefined;
        EventEmitter.defaultMaxListeners = 10;
        EventEmitter.prototype.setMaxListeners = function(n) {
          if (!isNumber(n) || n < 0 || isNaN(n))
            throw TypeError('n must be a positive number');
          this._maxListeners = n;
          return this;
        };
        EventEmitter.prototype.emit = function(type) {
          var er,
              handler,
              len,
              args,
              i,
              listeners;
          if (!this._events)
            this._events = {};
          if (type === 'error') {
            if (!this._events.error || (isObject(this._events.error) && !this._events.error.length)) {
              er = arguments[1];
              if (er instanceof Error) {
                throw er;
              }
              throw TypeError('Uncaught, unspecified "error" event.');
            }
          }
          handler = this._events[type];
          if (isUndefined(handler))
            return false;
          if (isFunction(handler)) {
            switch (arguments.length) {
              case 1:
                handler.call(this);
                break;
              case 2:
                handler.call(this, arguments[1]);
                break;
              case 3:
                handler.call(this, arguments[1], arguments[2]);
                break;
              default:
                len = arguments.length;
                args = new Array(len - 1);
                for (i = 1; i < len; i++)
                  args[i - 1] = arguments[i];
                handler.apply(this, args);
            }
          } else if (isObject(handler)) {
            len = arguments.length;
            args = new Array(len - 1);
            for (i = 1; i < len; i++)
              args[i - 1] = arguments[i];
            listeners = handler.slice();
            len = listeners.length;
            for (i = 0; i < len; i++)
              listeners[i].apply(this, args);
          }
          return true;
        };
        EventEmitter.prototype.addListener = function(type, listener) {
          var m;
          if (!isFunction(listener))
            throw TypeError('listener must be a function');
          if (!this._events)
            this._events = {};
          if (this._events.newListener)
            this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);
          if (!this._events[type])
            this._events[type] = listener;
          else if (isObject(this._events[type]))
            this._events[type].push(listener);
          else
            this._events[type] = [this._events[type], listener];
          if (isObject(this._events[type]) && !this._events[type].warned) {
            var m;
            if (!isUndefined(this._maxListeners)) {
              m = this._maxListeners;
            } else {
              m = EventEmitter.defaultMaxListeners;
            }
            if (m && m > 0 && this._events[type].length > m) {
              this._events[type].warned = true;
              console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
              if (typeof console.trace === 'function') {
                console.trace();
              }
            }
          }
          return this;
        };
        EventEmitter.prototype.on = EventEmitter.prototype.addListener;
        EventEmitter.prototype.once = function(type, listener) {
          if (!isFunction(listener))
            throw TypeError('listener must be a function');
          var fired = false;
          function g() {
            this.removeListener(type, g);
            if (!fired) {
              fired = true;
              listener.apply(this, arguments);
            }
          }
          g.listener = listener;
          this.on(type, g);
          return this;
        };
        EventEmitter.prototype.removeListener = function(type, listener) {
          var list,
              position,
              length,
              i;
          if (!isFunction(listener))
            throw TypeError('listener must be a function');
          if (!this._events || !this._events[type])
            return this;
          list = this._events[type];
          length = list.length;
          position = -1;
          if (list === listener || (isFunction(list.listener) && list.listener === listener)) {
            delete this._events[type];
            if (this._events.removeListener)
              this.emit('removeListener', type, listener);
          } else if (isObject(list)) {
            for (i = length; i-- > 0; ) {
              if (list[i] === listener || (list[i].listener && list[i].listener === listener)) {
                position = i;
                break;
              }
            }
            if (position < 0)
              return this;
            if (list.length === 1) {
              list.length = 0;
              delete this._events[type];
            } else {
              list.splice(position, 1);
            }
            if (this._events.removeListener)
              this.emit('removeListener', type, listener);
          }
          return this;
        };
        EventEmitter.prototype.removeAllListeners = function(type) {
          var key,
              listeners;
          if (!this._events)
            return this;
          if (!this._events.removeListener) {
            if (arguments.length === 0)
              this._events = {};
            else if (this._events[type])
              delete this._events[type];
            return this;
          }
          if (arguments.length === 0) {
            for (key in this._events) {
              if (key === 'removeListener')
                continue;
              this.removeAllListeners(key);
            }
            this.removeAllListeners('removeListener');
            this._events = {};
            return this;
          }
          listeners = this._events[type];
          if (isFunction(listeners)) {
            this.removeListener(type, listeners);
          } else {
            while (listeners.length)
              this.removeListener(type, listeners[listeners.length - 1]);
          }
          delete this._events[type];
          return this;
        };
        EventEmitter.prototype.listeners = function(type) {
          var ret;
          if (!this._events || !this._events[type])
            ret = [];
          else if (isFunction(this._events[type]))
            ret = [this._events[type]];
          else
            ret = this._events[type].slice();
          return ret;
        };
        EventEmitter.listenerCount = function(emitter, type) {
          var ret;
          if (!emitter._events || !emitter._events[type])
            ret = 0;
          else if (isFunction(emitter._events[type]))
            ret = 1;
          else
            ret = emitter._events[type].length;
          return ret;
        };
        function isFunction(arg) {
          return typeof arg === 'function';
        }
        function isNumber(arg) {
          return typeof arg === 'number';
        }
        function isObject(arg) {
          return typeof arg === 'object' && arg !== null;
        }
        function isUndefined(arg) {
          return arg === void 0;
        }
      }, {}],
      7: [function(require, module, exports) {
        if (typeof Object.create === 'function') {
          module.exports = function inherits(ctor, superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }});
          };
        } else {
          module.exports = function inherits(ctor, superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function() {};
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
          };
        }
      }, {}],
      8: [function(require, module, exports) {
        module.exports = Array.isArray || function(arr) {
          return Object.prototype.toString.call(arr) == '[object Array]';
        };
      }, {}],
      9: [function(require, module, exports) {
        var process = module.exports = {};
        var queue = [];
        var draining = false;
        function drainQueue() {
          if (draining) {
            return;
          }
          draining = true;
          var currentQueue;
          var len = queue.length;
          while (len) {
            currentQueue = queue;
            queue = [];
            var i = -1;
            while (++i < len) {
              currentQueue[i]();
            }
            len = queue.length;
          }
          draining = false;
        }
        process.nextTick = function(fun) {
          queue.push(fun);
          if (!draining) {
            setTimeout(drainQueue, 0);
          }
        };
        process.title = 'browser';
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = '';
        process.versions = {};
        function noop() {}
        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.binding = function(name) {
          throw new Error('process.binding is not supported');
        };
        process.cwd = function() {
          return '/';
        };
        process.chdir = function(dir) {
          throw new Error('process.chdir is not supported');
        };
        process.umask = function() {
          return 0;
        };
      }, {}],
      10: [function(require, module, exports) {
        module.exports = require('./lib/_stream_duplex');
      }, {"./lib/_stream_duplex.js": 11}],
      11: [function(require, module, exports) {
        (function(process) {
          module.exports = Duplex;
          var objectKeys = Object.keys || function(obj) {
            var keys = [];
            for (var key in obj)
              keys.push(key);
            return keys;
          };
          var util = require('core-util-is');
          util.inherits = require('inherits');
          var Readable = require('./_stream_readable');
          var Writable = require('./_stream_writable');
          util.inherits(Duplex, Readable);
          forEach(objectKeys(Writable.prototype), function(method) {
            if (!Duplex.prototype[method])
              Duplex.prototype[method] = Writable.prototype[method];
          });
          function Duplex(options) {
            if (!(this instanceof Duplex))
              return new Duplex(options);
            Readable.call(this, options);
            Writable.call(this, options);
            if (options && options.readable === false)
              this.readable = false;
            if (options && options.writable === false)
              this.writable = false;
            this.allowHalfOpen = true;
            if (options && options.allowHalfOpen === false)
              this.allowHalfOpen = false;
            this.once('end', onend);
          }
          function onend() {
            if (this.allowHalfOpen || this._writableState.ended)
              return;
            process.nextTick(this.end.bind(this));
          }
          function forEach(xs, f) {
            for (var i = 0,
                l = xs.length; i < l; i++) {
              f(xs[i], i);
            }
          }
        }).call(this, require('_process'));
      }, {
        "./_stream_readable": 13,
        "./_stream_writable": 15,
        "_process": 9,
        "core-util-is": 16,
        "inherits": 7
      }],
      12: [function(require, module, exports) {
        module.exports = PassThrough;
        var Transform = require('./_stream_transform');
        var util = require('core-util-is');
        util.inherits = require('inherits');
        util.inherits(PassThrough, Transform);
        function PassThrough(options) {
          if (!(this instanceof PassThrough))
            return new PassThrough(options);
          Transform.call(this, options);
        }
        PassThrough.prototype._transform = function(chunk, encoding, cb) {
          cb(null, chunk);
        };
      }, {
        "./_stream_transform": 14,
        "core-util-is": 16,
        "inherits": 7
      }],
      13: [function(require, module, exports) {
        (function(process) {
          module.exports = Readable;
          var isArray = require('isarray');
          var Buffer = require('buffer').Buffer;
          Readable.ReadableState = ReadableState;
          var EE = require('events').EventEmitter;
          if (!EE.listenerCount)
            EE.listenerCount = function(emitter, type) {
              return emitter.listeners(type).length;
            };
          var Stream = require('stream');
          var util = require('core-util-is');
          util.inherits = require('inherits');
          var StringDecoder;
          var debug = require('util');
          if (debug && debug.debuglog) {
            debug = debug.debuglog('stream');
          } else {
            debug = function() {};
          }
          util.inherits(Readable, Stream);
          function ReadableState(options, stream) {
            var Duplex = require('./_stream_duplex');
            options = options || {};
            var hwm = options.highWaterMark;
            var defaultHwm = options.objectMode ? 16 : 16 * 1024;
            this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;
            this.highWaterMark = ~~this.highWaterMark;
            this.buffer = [];
            this.length = 0;
            this.pipes = null;
            this.pipesCount = 0;
            this.flowing = null;
            this.ended = false;
            this.endEmitted = false;
            this.reading = false;
            this.sync = true;
            this.needReadable = false;
            this.emittedReadable = false;
            this.readableListening = false;
            this.objectMode = !!options.objectMode;
            if (stream instanceof Duplex)
              this.objectMode = this.objectMode || !!options.readableObjectMode;
            this.defaultEncoding = options.defaultEncoding || 'utf8';
            this.ranOut = false;
            this.awaitDrain = 0;
            this.readingMore = false;
            this.decoder = null;
            this.encoding = null;
            if (options.encoding) {
              if (!StringDecoder)
                StringDecoder = require('string_decoder').StringDecoder;
              this.decoder = new StringDecoder(options.encoding);
              this.encoding = options.encoding;
            }
          }
          function Readable(options) {
            var Duplex = require('./_stream_duplex');
            if (!(this instanceof Readable))
              return new Readable(options);
            this._readableState = new ReadableState(options, this);
            this.readable = true;
            Stream.call(this);
          }
          Readable.prototype.push = function(chunk, encoding) {
            var state = this._readableState;
            if (util.isString(chunk) && !state.objectMode) {
              encoding = encoding || state.defaultEncoding;
              if (encoding !== state.encoding) {
                chunk = new Buffer(chunk, encoding);
                encoding = '';
              }
            }
            return readableAddChunk(this, state, chunk, encoding, false);
          };
          Readable.prototype.unshift = function(chunk) {
            var state = this._readableState;
            return readableAddChunk(this, state, chunk, '', true);
          };
          function readableAddChunk(stream, state, chunk, encoding, addToFront) {
            var er = chunkInvalid(state, chunk);
            if (er) {
              stream.emit('error', er);
            } else if (util.isNullOrUndefined(chunk)) {
              state.reading = false;
              if (!state.ended)
                onEofChunk(stream, state);
            } else if (state.objectMode || chunk && chunk.length > 0) {
              if (state.ended && !addToFront) {
                var e = new Error('stream.push() after EOF');
                stream.emit('error', e);
              } else if (state.endEmitted && addToFront) {
                var e = new Error('stream.unshift() after end event');
                stream.emit('error', e);
              } else {
                if (state.decoder && !addToFront && !encoding)
                  chunk = state.decoder.write(chunk);
                if (!addToFront)
                  state.reading = false;
                if (state.flowing && state.length === 0 && !state.sync) {
                  stream.emit('data', chunk);
                  stream.read(0);
                } else {
                  state.length += state.objectMode ? 1 : chunk.length;
                  if (addToFront)
                    state.buffer.unshift(chunk);
                  else
                    state.buffer.push(chunk);
                  if (state.needReadable)
                    emitReadable(stream);
                }
                maybeReadMore(stream, state);
              }
            } else if (!addToFront) {
              state.reading = false;
            }
            return needMoreData(state);
          }
          function needMoreData(state) {
            return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
          }
          Readable.prototype.setEncoding = function(enc) {
            if (!StringDecoder)
              StringDecoder = require('string_decoder').StringDecoder;
            this._readableState.decoder = new StringDecoder(enc);
            this._readableState.encoding = enc;
            return this;
          };
          var MAX_HWM = 0x800000;
          function roundUpToNextPowerOf2(n) {
            if (n >= MAX_HWM) {
              n = MAX_HWM;
            } else {
              n--;
              for (var p = 1; p < 32; p <<= 1)
                n |= n >> p;
              n++;
            }
            return n;
          }
          function howMuchToRead(n, state) {
            if (state.length === 0 && state.ended)
              return 0;
            if (state.objectMode)
              return n === 0 ? 0 : 1;
            if (isNaN(n) || util.isNull(n)) {
              if (state.flowing && state.buffer.length)
                return state.buffer[0].length;
              else
                return state.length;
            }
            if (n <= 0)
              return 0;
            if (n > state.highWaterMark)
              state.highWaterMark = roundUpToNextPowerOf2(n);
            if (n > state.length) {
              if (!state.ended) {
                state.needReadable = true;
                return 0;
              } else
                return state.length;
            }
            return n;
          }
          Readable.prototype.read = function(n) {
            debug('read', n);
            var state = this._readableState;
            var nOrig = n;
            if (!util.isNumber(n) || n > 0)
              state.emittedReadable = false;
            if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
              debug('read: emitReadable', state.length, state.ended);
              if (state.length === 0 && state.ended)
                endReadable(this);
              else
                emitReadable(this);
              return null;
            }
            n = howMuchToRead(n, state);
            if (n === 0 && state.ended) {
              if (state.length === 0)
                endReadable(this);
              return null;
            }
            var doRead = state.needReadable;
            debug('need readable', doRead);
            if (state.length === 0 || state.length - n < state.highWaterMark) {
              doRead = true;
              debug('length less than watermark', doRead);
            }
            if (state.ended || state.reading) {
              doRead = false;
              debug('reading or ended', doRead);
            }
            if (doRead) {
              debug('do read');
              state.reading = true;
              state.sync = true;
              if (state.length === 0)
                state.needReadable = true;
              this._read(state.highWaterMark);
              state.sync = false;
            }
            if (doRead && !state.reading)
              n = howMuchToRead(nOrig, state);
            var ret;
            if (n > 0)
              ret = fromList(n, state);
            else
              ret = null;
            if (util.isNull(ret)) {
              state.needReadable = true;
              n = 0;
            }
            state.length -= n;
            if (state.length === 0 && !state.ended)
              state.needReadable = true;
            if (nOrig !== n && state.ended && state.length === 0)
              endReadable(this);
            if (!util.isNull(ret))
              this.emit('data', ret);
            return ret;
          };
          function chunkInvalid(state, chunk) {
            var er = null;
            if (!util.isBuffer(chunk) && !util.isString(chunk) && !util.isNullOrUndefined(chunk) && !state.objectMode) {
              er = new TypeError('Invalid non-string/buffer chunk');
            }
            return er;
          }
          function onEofChunk(stream, state) {
            if (state.decoder && !state.ended) {
              var chunk = state.decoder.end();
              if (chunk && chunk.length) {
                state.buffer.push(chunk);
                state.length += state.objectMode ? 1 : chunk.length;
              }
            }
            state.ended = true;
            emitReadable(stream);
          }
          function emitReadable(stream) {
            var state = stream._readableState;
            state.needReadable = false;
            if (!state.emittedReadable) {
              debug('emitReadable', state.flowing);
              state.emittedReadable = true;
              if (state.sync)
                process.nextTick(function() {
                  emitReadable_(stream);
                });
              else
                emitReadable_(stream);
            }
          }
          function emitReadable_(stream) {
            debug('emit readable');
            stream.emit('readable');
            flow(stream);
          }
          function maybeReadMore(stream, state) {
            if (!state.readingMore) {
              state.readingMore = true;
              process.nextTick(function() {
                maybeReadMore_(stream, state);
              });
            }
          }
          function maybeReadMore_(stream, state) {
            var len = state.length;
            while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
              debug('maybeReadMore read 0');
              stream.read(0);
              if (len === state.length)
                break;
              else
                len = state.length;
            }
            state.readingMore = false;
          }
          Readable.prototype._read = function(n) {
            this.emit('error', new Error('not implemented'));
          };
          Readable.prototype.pipe = function(dest, pipeOpts) {
            var src = this;
            var state = this._readableState;
            switch (state.pipesCount) {
              case 0:
                state.pipes = dest;
                break;
              case 1:
                state.pipes = [state.pipes, dest];
                break;
              default:
                state.pipes.push(dest);
                break;
            }
            state.pipesCount += 1;
            debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
            var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
            var endFn = doEnd ? onend : cleanup;
            if (state.endEmitted)
              process.nextTick(endFn);
            else
              src.once('end', endFn);
            dest.on('unpipe', onunpipe);
            function onunpipe(readable) {
              debug('onunpipe');
              if (readable === src) {
                cleanup();
              }
            }
            function onend() {
              debug('onend');
              dest.end();
            }
            var ondrain = pipeOnDrain(src);
            dest.on('drain', ondrain);
            function cleanup() {
              debug('cleanup');
              dest.removeListener('close', onclose);
              dest.removeListener('finish', onfinish);
              dest.removeListener('drain', ondrain);
              dest.removeListener('error', onerror);
              dest.removeListener('unpipe', onunpipe);
              src.removeListener('end', onend);
              src.removeListener('end', cleanup);
              src.removeListener('data', ondata);
              if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
                ondrain();
            }
            src.on('data', ondata);
            function ondata(chunk) {
              debug('ondata');
              var ret = dest.write(chunk);
              if (false === ret) {
                debug('false write response, pause', src._readableState.awaitDrain);
                src._readableState.awaitDrain++;
                src.pause();
              }
            }
            function onerror(er) {
              debug('onerror', er);
              unpipe();
              dest.removeListener('error', onerror);
              if (EE.listenerCount(dest, 'error') === 0)
                dest.emit('error', er);
            }
            if (!dest._events || !dest._events.error)
              dest.on('error', onerror);
            else if (isArray(dest._events.error))
              dest._events.error.unshift(onerror);
            else
              dest._events.error = [onerror, dest._events.error];
            function onclose() {
              dest.removeListener('finish', onfinish);
              unpipe();
            }
            dest.once('close', onclose);
            function onfinish() {
              debug('onfinish');
              dest.removeListener('close', onclose);
              unpipe();
            }
            dest.once('finish', onfinish);
            function unpipe() {
              debug('unpipe');
              src.unpipe(dest);
            }
            dest.emit('pipe', src);
            if (!state.flowing) {
              debug('pipe resume');
              src.resume();
            }
            return dest;
          };
          function pipeOnDrain(src) {
            return function() {
              var state = src._readableState;
              debug('pipeOnDrain', state.awaitDrain);
              if (state.awaitDrain)
                state.awaitDrain--;
              if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
                state.flowing = true;
                flow(src);
              }
            };
          }
          Readable.prototype.unpipe = function(dest) {
            var state = this._readableState;
            if (state.pipesCount === 0)
              return this;
            if (state.pipesCount === 1) {
              if (dest && dest !== state.pipes)
                return this;
              if (!dest)
                dest = state.pipes;
              state.pipes = null;
              state.pipesCount = 0;
              state.flowing = false;
              if (dest)
                dest.emit('unpipe', this);
              return this;
            }
            if (!dest) {
              var dests = state.pipes;
              var len = state.pipesCount;
              state.pipes = null;
              state.pipesCount = 0;
              state.flowing = false;
              for (var i = 0; i < len; i++)
                dests[i].emit('unpipe', this);
              return this;
            }
            var i = indexOf(state.pipes, dest);
            if (i === -1)
              return this;
            state.pipes.splice(i, 1);
            state.pipesCount -= 1;
            if (state.pipesCount === 1)
              state.pipes = state.pipes[0];
            dest.emit('unpipe', this);
            return this;
          };
          Readable.prototype.on = function(ev, fn) {
            var res = Stream.prototype.on.call(this, ev, fn);
            if (ev === 'data' && false !== this._readableState.flowing) {
              this.resume();
            }
            if (ev === 'readable' && this.readable) {
              var state = this._readableState;
              if (!state.readableListening) {
                state.readableListening = true;
                state.emittedReadable = false;
                state.needReadable = true;
                if (!state.reading) {
                  var self = this;
                  process.nextTick(function() {
                    debug('readable nexttick read 0');
                    self.read(0);
                  });
                } else if (state.length) {
                  emitReadable(this, state);
                }
              }
            }
            return res;
          };
          Readable.prototype.addListener = Readable.prototype.on;
          Readable.prototype.resume = function() {
            var state = this._readableState;
            if (!state.flowing) {
              debug('resume');
              state.flowing = true;
              if (!state.reading) {
                debug('resume read 0');
                this.read(0);
              }
              resume(this, state);
            }
            return this;
          };
          function resume(stream, state) {
            if (!state.resumeScheduled) {
              state.resumeScheduled = true;
              process.nextTick(function() {
                resume_(stream, state);
              });
            }
          }
          function resume_(stream, state) {
            state.resumeScheduled = false;
            stream.emit('resume');
            flow(stream);
            if (state.flowing && !state.reading)
              stream.read(0);
          }
          Readable.prototype.pause = function() {
            debug('call pause flowing=%j', this._readableState.flowing);
            if (false !== this._readableState.flowing) {
              debug('pause');
              this._readableState.flowing = false;
              this.emit('pause');
            }
            return this;
          };
          function flow(stream) {
            var state = stream._readableState;
            debug('flow', state.flowing);
            if (state.flowing) {
              do {
                var chunk = stream.read();
              } while (null !== chunk && state.flowing);
            }
          }
          Readable.prototype.wrap = function(stream) {
            var state = this._readableState;
            var paused = false;
            var self = this;
            stream.on('end', function() {
              debug('wrapped end');
              if (state.decoder && !state.ended) {
                var chunk = state.decoder.end();
                if (chunk && chunk.length)
                  self.push(chunk);
              }
              self.push(null);
            });
            stream.on('data', function(chunk) {
              debug('wrapped data');
              if (state.decoder)
                chunk = state.decoder.write(chunk);
              if (!chunk || !state.objectMode && !chunk.length)
                return;
              var ret = self.push(chunk);
              if (!ret) {
                paused = true;
                stream.pause();
              }
            });
            for (var i in stream) {
              if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
                this[i] = function(method) {
                  return function() {
                    return stream[method].apply(stream, arguments);
                  };
                }(i);
              }
            }
            var events = ['error', 'close', 'destroy', 'pause', 'resume'];
            forEach(events, function(ev) {
              stream.on(ev, self.emit.bind(self, ev));
            });
            self._read = function(n) {
              debug('wrapped _read', n);
              if (paused) {
                paused = false;
                stream.resume();
              }
            };
            return self;
          };
          Readable._fromList = fromList;
          function fromList(n, state) {
            var list = state.buffer;
            var length = state.length;
            var stringMode = !!state.decoder;
            var objectMode = !!state.objectMode;
            var ret;
            if (list.length === 0)
              return null;
            if (length === 0)
              ret = null;
            else if (objectMode)
              ret = list.shift();
            else if (!n || n >= length) {
              if (stringMode)
                ret = list.join('');
              else
                ret = Buffer.concat(list, length);
              list.length = 0;
            } else {
              if (n < list[0].length) {
                var buf = list[0];
                ret = buf.slice(0, n);
                list[0] = buf.slice(n);
              } else if (n === list[0].length) {
                ret = list.shift();
              } else {
                if (stringMode)
                  ret = '';
                else
                  ret = new Buffer(n);
                var c = 0;
                for (var i = 0,
                    l = list.length; i < l && c < n; i++) {
                  var buf = list[0];
                  var cpy = Math.min(n - c, buf.length);
                  if (stringMode)
                    ret += buf.slice(0, cpy);
                  else
                    buf.copy(ret, c, 0, cpy);
                  if (cpy < buf.length)
                    list[0] = buf.slice(cpy);
                  else
                    list.shift();
                  c += cpy;
                }
              }
            }
            return ret;
          }
          function endReadable(stream) {
            var state = stream._readableState;
            if (state.length > 0)
              throw new Error('endReadable called on non-empty stream');
            if (!state.endEmitted) {
              state.ended = true;
              process.nextTick(function() {
                if (!state.endEmitted && state.length === 0) {
                  state.endEmitted = true;
                  stream.readable = false;
                  stream.emit('end');
                }
              });
            }
          }
          function forEach(xs, f) {
            for (var i = 0,
                l = xs.length; i < l; i++) {
              f(xs[i], i);
            }
          }
          function indexOf(xs, x) {
            for (var i = 0,
                l = xs.length; i < l; i++) {
              if (xs[i] === x)
                return i;
            }
            return -1;
          }
        }).call(this, require('_process'));
      }, {
        "./_stream_duplex": 11,
        "_process": 9,
        "buffer": 2,
        "core-util-is": 16,
        "events": 6,
        "inherits": 7,
        "isarray": 8,
        "stream": 21,
        "string_decoder/": 22,
        "util": 1
      }],
      14: [function(require, module, exports) {
        module.exports = Transform;
        var Duplex = require('./_stream_duplex');
        var util = require('core-util-is');
        util.inherits = require('inherits');
        util.inherits(Transform, Duplex);
        function TransformState(options, stream) {
          this.afterTransform = function(er, data) {
            return afterTransform(stream, er, data);
          };
          this.needTransform = false;
          this.transforming = false;
          this.writecb = null;
          this.writechunk = null;
        }
        function afterTransform(stream, er, data) {
          var ts = stream._transformState;
          ts.transforming = false;
          var cb = ts.writecb;
          if (!cb)
            return stream.emit('error', new Error('no writecb in Transform class'));
          ts.writechunk = null;
          ts.writecb = null;
          if (!util.isNullOrUndefined(data))
            stream.push(data);
          if (cb)
            cb(er);
          var rs = stream._readableState;
          rs.reading = false;
          if (rs.needReadable || rs.length < rs.highWaterMark) {
            stream._read(rs.highWaterMark);
          }
        }
        function Transform(options) {
          if (!(this instanceof Transform))
            return new Transform(options);
          Duplex.call(this, options);
          this._transformState = new TransformState(options, this);
          var stream = this;
          this._readableState.needReadable = true;
          this._readableState.sync = false;
          this.once('prefinish', function() {
            if (util.isFunction(this._flush))
              this._flush(function(er) {
                done(stream, er);
              });
            else
              done(stream);
          });
        }
        Transform.prototype.push = function(chunk, encoding) {
          this._transformState.needTransform = false;
          return Duplex.prototype.push.call(this, chunk, encoding);
        };
        Transform.prototype._transform = function(chunk, encoding, cb) {
          throw new Error('not implemented');
        };
        Transform.prototype._write = function(chunk, encoding, cb) {
          var ts = this._transformState;
          ts.writecb = cb;
          ts.writechunk = chunk;
          ts.writeencoding = encoding;
          if (!ts.transforming) {
            var rs = this._readableState;
            if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
              this._read(rs.highWaterMark);
          }
        };
        Transform.prototype._read = function(n) {
          var ts = this._transformState;
          if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
            ts.transforming = true;
            this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
          } else {
            ts.needTransform = true;
          }
        };
        function done(stream, er) {
          if (er)
            return stream.emit('error', er);
          var ws = stream._writableState;
          var ts = stream._transformState;
          if (ws.length)
            throw new Error('calling transform done when ws.length != 0');
          if (ts.transforming)
            throw new Error('calling transform done when still transforming');
          return stream.push(null);
        }
      }, {
        "./_stream_duplex": 11,
        "core-util-is": 16,
        "inherits": 7
      }],
      15: [function(require, module, exports) {
        (function(process) {
          module.exports = Writable;
          var Buffer = require('buffer').Buffer;
          Writable.WritableState = WritableState;
          var util = require('core-util-is');
          util.inherits = require('inherits');
          var Stream = require('stream');
          util.inherits(Writable, Stream);
          function WriteReq(chunk, encoding, cb) {
            this.chunk = chunk;
            this.encoding = encoding;
            this.callback = cb;
          }
          function WritableState(options, stream) {
            var Duplex = require('./_stream_duplex');
            options = options || {};
            var hwm = options.highWaterMark;
            var defaultHwm = options.objectMode ? 16 : 16 * 1024;
            this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;
            this.objectMode = !!options.objectMode;
            if (stream instanceof Duplex)
              this.objectMode = this.objectMode || !!options.writableObjectMode;
            this.highWaterMark = ~~this.highWaterMark;
            this.needDrain = false;
            this.ending = false;
            this.ended = false;
            this.finished = false;
            var noDecode = options.decodeStrings === false;
            this.decodeStrings = !noDecode;
            this.defaultEncoding = options.defaultEncoding || 'utf8';
            this.length = 0;
            this.writing = false;
            this.corked = 0;
            this.sync = true;
            this.bufferProcessing = false;
            this.onwrite = function(er) {
              onwrite(stream, er);
            };
            this.writecb = null;
            this.writelen = 0;
            this.buffer = [];
            this.pendingcb = 0;
            this.prefinished = false;
            this.errorEmitted = false;
          }
          function Writable(options) {
            var Duplex = require('./_stream_duplex');
            if (!(this instanceof Writable) && !(this instanceof Duplex))
              return new Writable(options);
            this._writableState = new WritableState(options, this);
            this.writable = true;
            Stream.call(this);
          }
          Writable.prototype.pipe = function() {
            this.emit('error', new Error('Cannot pipe. Not readable.'));
          };
          function writeAfterEnd(stream, state, cb) {
            var er = new Error('write after end');
            stream.emit('error', er);
            process.nextTick(function() {
              cb(er);
            });
          }
          function validChunk(stream, state, chunk, cb) {
            var valid = true;
            if (!util.isBuffer(chunk) && !util.isString(chunk) && !util.isNullOrUndefined(chunk) && !state.objectMode) {
              var er = new TypeError('Invalid non-string/buffer chunk');
              stream.emit('error', er);
              process.nextTick(function() {
                cb(er);
              });
              valid = false;
            }
            return valid;
          }
          Writable.prototype.write = function(chunk, encoding, cb) {
            var state = this._writableState;
            var ret = false;
            if (util.isFunction(encoding)) {
              cb = encoding;
              encoding = null;
            }
            if (util.isBuffer(chunk))
              encoding = 'buffer';
            else if (!encoding)
              encoding = state.defaultEncoding;
            if (!util.isFunction(cb))
              cb = function() {};
            if (state.ended)
              writeAfterEnd(this, state, cb);
            else if (validChunk(this, state, chunk, cb)) {
              state.pendingcb++;
              ret = writeOrBuffer(this, state, chunk, encoding, cb);
            }
            return ret;
          };
          Writable.prototype.cork = function() {
            var state = this._writableState;
            state.corked++;
          };
          Writable.prototype.uncork = function() {
            var state = this._writableState;
            if (state.corked) {
              state.corked--;
              if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.buffer.length)
                clearBuffer(this, state);
            }
          };
          function decodeChunk(state, chunk, encoding) {
            if (!state.objectMode && state.decodeStrings !== false && util.isString(chunk)) {
              chunk = new Buffer(chunk, encoding);
            }
            return chunk;
          }
          function writeOrBuffer(stream, state, chunk, encoding, cb) {
            chunk = decodeChunk(state, chunk, encoding);
            if (util.isBuffer(chunk))
              encoding = 'buffer';
            var len = state.objectMode ? 1 : chunk.length;
            state.length += len;
            var ret = state.length < state.highWaterMark;
            if (!ret)
              state.needDrain = true;
            if (state.writing || state.corked)
              state.buffer.push(new WriteReq(chunk, encoding, cb));
            else
              doWrite(stream, state, false, len, chunk, encoding, cb);
            return ret;
          }
          function doWrite(stream, state, writev, len, chunk, encoding, cb) {
            state.writelen = len;
            state.writecb = cb;
            state.writing = true;
            state.sync = true;
            if (writev)
              stream._writev(chunk, state.onwrite);
            else
              stream._write(chunk, encoding, state.onwrite);
            state.sync = false;
          }
          function onwriteError(stream, state, sync, er, cb) {
            if (sync)
              process.nextTick(function() {
                state.pendingcb--;
                cb(er);
              });
            else {
              state.pendingcb--;
              cb(er);
            }
            stream._writableState.errorEmitted = true;
            stream.emit('error', er);
          }
          function onwriteStateUpdate(state) {
            state.writing = false;
            state.writecb = null;
            state.length -= state.writelen;
            state.writelen = 0;
          }
          function onwrite(stream, er) {
            var state = stream._writableState;
            var sync = state.sync;
            var cb = state.writecb;
            onwriteStateUpdate(state);
            if (er)
              onwriteError(stream, state, sync, er, cb);
            else {
              var finished = needFinish(stream, state);
              if (!finished && !state.corked && !state.bufferProcessing && state.buffer.length) {
                clearBuffer(stream, state);
              }
              if (sync) {
                process.nextTick(function() {
                  afterWrite(stream, state, finished, cb);
                });
              } else {
                afterWrite(stream, state, finished, cb);
              }
            }
          }
          function afterWrite(stream, state, finished, cb) {
            if (!finished)
              onwriteDrain(stream, state);
            state.pendingcb--;
            cb();
            finishMaybe(stream, state);
          }
          function onwriteDrain(stream, state) {
            if (state.length === 0 && state.needDrain) {
              state.needDrain = false;
              stream.emit('drain');
            }
          }
          function clearBuffer(stream, state) {
            state.bufferProcessing = true;
            if (stream._writev && state.buffer.length > 1) {
              var cbs = [];
              for (var c = 0; c < state.buffer.length; c++)
                cbs.push(state.buffer[c].callback);
              state.pendingcb++;
              doWrite(stream, state, true, state.length, state.buffer, '', function(err) {
                for (var i = 0; i < cbs.length; i++) {
                  state.pendingcb--;
                  cbs[i](err);
                }
              });
              state.buffer = [];
            } else {
              for (var c = 0; c < state.buffer.length; c++) {
                var entry = state.buffer[c];
                var chunk = entry.chunk;
                var encoding = entry.encoding;
                var cb = entry.callback;
                var len = state.objectMode ? 1 : chunk.length;
                doWrite(stream, state, false, len, chunk, encoding, cb);
                if (state.writing) {
                  c++;
                  break;
                }
              }
              if (c < state.buffer.length)
                state.buffer = state.buffer.slice(c);
              else
                state.buffer.length = 0;
            }
            state.bufferProcessing = false;
          }
          Writable.prototype._write = function(chunk, encoding, cb) {
            cb(new Error('not implemented'));
          };
          Writable.prototype._writev = null;
          Writable.prototype.end = function(chunk, encoding, cb) {
            var state = this._writableState;
            if (util.isFunction(chunk)) {
              cb = chunk;
              chunk = null;
              encoding = null;
            } else if (util.isFunction(encoding)) {
              cb = encoding;
              encoding = null;
            }
            if (!util.isNullOrUndefined(chunk))
              this.write(chunk, encoding);
            if (state.corked) {
              state.corked = 1;
              this.uncork();
            }
            if (!state.ending && !state.finished)
              endWritable(this, state, cb);
          };
          function needFinish(stream, state) {
            return (state.ending && state.length === 0 && !state.finished && !state.writing);
          }
          function prefinish(stream, state) {
            if (!state.prefinished) {
              state.prefinished = true;
              stream.emit('prefinish');
            }
          }
          function finishMaybe(stream, state) {
            var need = needFinish(stream, state);
            if (need) {
              if (state.pendingcb === 0) {
                prefinish(stream, state);
                state.finished = true;
                stream.emit('finish');
              } else
                prefinish(stream, state);
            }
            return need;
          }
          function endWritable(stream, state, cb) {
            state.ending = true;
            finishMaybe(stream, state);
            if (cb) {
              if (state.finished)
                process.nextTick(cb);
              else
                stream.once('finish', cb);
            }
            state.ended = true;
          }
        }).call(this, require('_process'));
      }, {
        "./_stream_duplex": 11,
        "_process": 9,
        "buffer": 2,
        "core-util-is": 16,
        "inherits": 7,
        "stream": 21
      }],
      16: [function(require, module, exports) {
        (function(Buffer) {
          function isArray(ar) {
            return Array.isArray(ar);
          }
          exports.isArray = isArray;
          function isBoolean(arg) {
            return typeof arg === 'boolean';
          }
          exports.isBoolean = isBoolean;
          function isNull(arg) {
            return arg === null;
          }
          exports.isNull = isNull;
          function isNullOrUndefined(arg) {
            return arg == null;
          }
          exports.isNullOrUndefined = isNullOrUndefined;
          function isNumber(arg) {
            return typeof arg === 'number';
          }
          exports.isNumber = isNumber;
          function isString(arg) {
            return typeof arg === 'string';
          }
          exports.isString = isString;
          function isSymbol(arg) {
            return typeof arg === 'symbol';
          }
          exports.isSymbol = isSymbol;
          function isUndefined(arg) {
            return arg === void 0;
          }
          exports.isUndefined = isUndefined;
          function isRegExp(re) {
            return isObject(re) && objectToString(re) === '[object RegExp]';
          }
          exports.isRegExp = isRegExp;
          function isObject(arg) {
            return typeof arg === 'object' && arg !== null;
          }
          exports.isObject = isObject;
          function isDate(d) {
            return isObject(d) && objectToString(d) === '[object Date]';
          }
          exports.isDate = isDate;
          function isError(e) {
            return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
          }
          exports.isError = isError;
          function isFunction(arg) {
            return typeof arg === 'function';
          }
          exports.isFunction = isFunction;
          function isPrimitive(arg) {
            return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || typeof arg === 'undefined';
          }
          exports.isPrimitive = isPrimitive;
          function isBuffer(arg) {
            return Buffer.isBuffer(arg);
          }
          exports.isBuffer = isBuffer;
          function objectToString(o) {
            return Object.prototype.toString.call(o);
          }
        }).call(this, require('buffer').Buffer);
      }, {"buffer": 2}],
      17: [function(require, module, exports) {
        module.exports = require('./lib/_stream_passthrough');
      }, {"./lib/_stream_passthrough.js": 12}],
      18: [function(require, module, exports) {
        exports = module.exports = require('./lib/_stream_readable');
        exports.Stream = require('stream');
        exports.Readable = exports;
        exports.Writable = require('./lib/_stream_writable');
        exports.Duplex = require('./lib/_stream_duplex');
        exports.Transform = require('./lib/_stream_transform');
        exports.PassThrough = require('./lib/_stream_passthrough');
      }, {
        "./lib/_stream_duplex.js": 11,
        "./lib/_stream_passthrough.js": 12,
        "./lib/_stream_readable.js": 13,
        "./lib/_stream_transform.js": 14,
        "./lib/_stream_writable.js": 15,
        "stream": 21
      }],
      19: [function(require, module, exports) {
        module.exports = require('./lib/_stream_transform');
      }, {"./lib/_stream_transform.js": 14}],
      20: [function(require, module, exports) {
        module.exports = require('./lib/_stream_writable');
      }, {"./lib/_stream_writable.js": 15}],
      21: [function(require, module, exports) {
        module.exports = Stream;
        var EE = require('events').EventEmitter;
        var inherits = require('inherits');
        inherits(Stream, EE);
        Stream.Readable = require('readable-stream/readable');
        Stream.Writable = require('readable-stream/writable');
        Stream.Duplex = require('readable-stream/duplex');
        Stream.Transform = require('readable-stream/transform');
        Stream.PassThrough = require('readable-stream/passthrough');
        Stream.Stream = Stream;
        function Stream() {
          EE.call(this);
        }
        Stream.prototype.pipe = function(dest, options) {
          var source = this;
          function ondata(chunk) {
            if (dest.writable) {
              if (false === dest.write(chunk) && source.pause) {
                source.pause();
              }
            }
          }
          source.on('data', ondata);
          function ondrain() {
            if (source.readable && source.resume) {
              source.resume();
            }
          }
          dest.on('drain', ondrain);
          if (!dest._isStdio && (!options || options.end !== false)) {
            source.on('end', onend);
            source.on('close', onclose);
          }
          var didOnEnd = false;
          function onend() {
            if (didOnEnd)
              return;
            didOnEnd = true;
            dest.end();
          }
          function onclose() {
            if (didOnEnd)
              return;
            didOnEnd = true;
            if (typeof dest.destroy === 'function')
              dest.destroy();
          }
          function onerror(er) {
            cleanup();
            if (EE.listenerCount(this, 'error') === 0) {
              throw er;
            }
          }
          source.on('error', onerror);
          dest.on('error', onerror);
          function cleanup() {
            source.removeListener('data', ondata);
            dest.removeListener('drain', ondrain);
            source.removeListener('end', onend);
            source.removeListener('close', onclose);
            source.removeListener('error', onerror);
            dest.removeListener('error', onerror);
            source.removeListener('end', cleanup);
            source.removeListener('close', cleanup);
            dest.removeListener('close', cleanup);
          }
          source.on('end', cleanup);
          source.on('close', cleanup);
          dest.on('close', cleanup);
          dest.emit('pipe', source);
          return dest;
        };
      }, {
        "events": 6,
        "inherits": 7,
        "readable-stream/duplex.js": 10,
        "readable-stream/passthrough.js": 17,
        "readable-stream/readable.js": 18,
        "readable-stream/transform.js": 19,
        "readable-stream/writable.js": 20
      }],
      22: [function(require, module, exports) {
        var Buffer = require('buffer').Buffer;
        var isBufferEncoding = Buffer.isEncoding || function(encoding) {
          switch (encoding && encoding.toLowerCase()) {
            case 'hex':
            case 'utf8':
            case 'utf-8':
            case 'ascii':
            case 'binary':
            case 'base64':
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
            case 'raw':
              return true;
            default:
              return false;
          }
        };
        function assertEncoding(encoding) {
          if (encoding && !isBufferEncoding(encoding)) {
            throw new Error('Unknown encoding: ' + encoding);
          }
        }
        var StringDecoder = exports.StringDecoder = function(encoding) {
          this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
          assertEncoding(encoding);
          switch (this.encoding) {
            case 'utf8':
              this.surrogateSize = 3;
              break;
            case 'ucs2':
            case 'utf16le':
              this.surrogateSize = 2;
              this.detectIncompleteChar = utf16DetectIncompleteChar;
              break;
            case 'base64':
              this.surrogateSize = 3;
              this.detectIncompleteChar = base64DetectIncompleteChar;
              break;
            default:
              this.write = passThroughWrite;
              return;
          }
          this.charBuffer = new Buffer(6);
          this.charReceived = 0;
          this.charLength = 0;
        };
        StringDecoder.prototype.write = function(buffer) {
          var charStr = '';
          while (this.charLength) {
            var available = (buffer.length >= this.charLength - this.charReceived) ? this.charLength - this.charReceived : buffer.length;
            buffer.copy(this.charBuffer, this.charReceived, 0, available);
            this.charReceived += available;
            if (this.charReceived < this.charLength) {
              return '';
            }
            buffer = buffer.slice(available, buffer.length);
            charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
            var charCode = charStr.charCodeAt(charStr.length - 1);
            if (charCode >= 0xD800 && charCode <= 0xDBFF) {
              this.charLength += this.surrogateSize;
              charStr = '';
              continue;
            }
            this.charReceived = this.charLength = 0;
            if (buffer.length === 0) {
              return charStr;
            }
            break;
          }
          this.detectIncompleteChar(buffer);
          var end = buffer.length;
          if (this.charLength) {
            buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
            end -= this.charReceived;
          }
          charStr += buffer.toString(this.encoding, 0, end);
          var end = charStr.length - 1;
          var charCode = charStr.charCodeAt(end);
          if (charCode >= 0xD800 && charCode <= 0xDBFF) {
            var size = this.surrogateSize;
            this.charLength += size;
            this.charReceived += size;
            this.charBuffer.copy(this.charBuffer, size, 0, size);
            buffer.copy(this.charBuffer, 0, 0, size);
            return charStr.substring(0, end);
          }
          return charStr;
        };
        StringDecoder.prototype.detectIncompleteChar = function(buffer) {
          var i = (buffer.length >= 3) ? 3 : buffer.length;
          for (; i > 0; i--) {
            var c = buffer[buffer.length - i];
            if (i == 1 && c >> 5 == 0x06) {
              this.charLength = 2;
              break;
            }
            if (i <= 2 && c >> 4 == 0x0E) {
              this.charLength = 3;
              break;
            }
            if (i <= 3 && c >> 3 == 0x1E) {
              this.charLength = 4;
              break;
            }
          }
          this.charReceived = i;
        };
        StringDecoder.prototype.end = function(buffer) {
          var res = '';
          if (buffer && buffer.length)
            res = this.write(buffer);
          if (this.charReceived) {
            var cr = this.charReceived;
            var buf = this.charBuffer;
            var enc = this.encoding;
            res += buf.slice(0, cr).toString(enc);
          }
          return res;
        };
        function passThroughWrite(buffer) {
          return buffer.toString(this.encoding);
        }
        function utf16DetectIncompleteChar(buffer) {
          this.charReceived = buffer.length % 2;
          this.charLength = this.charReceived ? 2 : 0;
        }
        function base64DetectIncompleteChar(buffer) {
          this.charReceived = buffer.length % 3;
          this.charLength = this.charReceived ? 3 : 0;
        }
      }, {"buffer": 2}],
      23: [function(require, module, exports) {
        window.myDebug = require('debug');
        var Peer = require('simple-peer');
        var Emitter = require('component-emitter');
        var parser = require('socket.io-parser');
        var toArray = require('to-array');
        var hasBin = require('has-binary');
        var bind = require('component-bind');
        var debug = require('debug')('socket');
        var hat = require('hat');
        var extend = require('extend.js');
        var rtcSupport = require('webrtcsupport');
        var emitfn = Emitter.prototype.emit;
        function Socketiop2p(socket, opts, cb) {
          var self = this;
          self.useSockets = true;
          self.usePeerConnection = false;
          self.decoder = new parser.Decoder(this);
          self.decoder.on('decoded', bind(this, this.ondecoded));
          self.socket = socket;
          self.cb = cb;
          self._peers = {};
          self.readyPeers = 0;
          self.ready = false;
          self._peerEvents = {
            upgrade: 1,
            error: 1,
            peer_signal: 1,
            peer_ready: 1,
            stream: 1
          };
          var defaultOpts = {
            autoUpgrade: true,
            numClients: 5
          };
          self.opts = extend(defaultOpts, (opts || {}));
          self.peerOpts = self.opts.peerOpts || {};
          self.numConnectedClients;
          socket.on('numClients', function(numClients) {
            self.peerId = socket.io.engine.id;
            self.numConnectedClients = numClients;
            if (rtcSupport.supportDataChannel) {
              generateOffers(function(offers) {
                var offerObj = {
                  offers: offers,
                  fromPeerId: self.peerId
                };
                socket.emit('offers', offerObj);
              });
            }
            function generateOffers(cb) {
              var offers = [];
              for (var i = 0; i < self.opts.numClients; ++i) {
                generateOffer();
              }
              function generateOffer() {
                var offerId = hat(160);
                var peerOpts = extend(self.peerOpts, {initiator: true});
                var peer = self._peers[offerId] = new Peer(peerOpts);
                peer.setMaxListeners(50);
                self.setupPeerEvents(peer);
                peer.on('signal', function(offer) {
                  offers.push({
                    offer: offer,
                    offerId: offerId
                  });
                  checkDone();
                });
                peer.on('error', function(err) {
                  emitfn.call(this, 'peer-error', err);
                  debug('Error in peer %s', err);
                });
              }
              function checkDone() {
                if (offers.length === self.opts.numClients) {
                  debug('generated %s offers', self.opts.numClients);
                  cb(offers);
                }
              }
            }
          });
          socket.on('offer', function(data) {
            var peerOpts = extend(self.peerOpts, {initiator: false});
            var peer = self._peers[data.fromPeerId] = new Peer(peerOpts);
            self.numConnectedClients++;
            peer.setMaxListeners(50);
            self.setupPeerEvents(peer);
            peer.on('signal', function(signalData) {
              var signalObj = {
                signal: signalData,
                offerId: data.offerId,
                fromPeerId: self.peerId,
                toPeerId: data.fromPeerId
              };
              socket.emit('peer-signal', signalObj);
            });
            peer.on('error', function(err) {
              emitfn.call(this, 'peer-error', err);
              debug('Error in peer %s', err);
            });
            peer.signal(data.offer);
          });
          socket.on('peer-signal', function(data) {
            var peer = self._peers[data.offerId] || self._peers[data.fromPeerId];
            peer.on('signal', function signal(signalData) {
              var signalObj = {
                signal: signalData,
                offerId: data.offerId,
                fromPeerId: self.peerId,
                toPeerId: data.fromPeerId
              };
              socket.emit('peer-signal', signalObj);
            });
            peer.signal(data.signal);
          });
          self.on('peer_ready', function(peer) {
            self.readyPeers++;
            if (self.readyPeers >= self.numConnectedClients && !self.ready) {
              self.ready = true;
              if (self.opts.autoUpgrade)
                self.usePeerConnection = true;
              if (typeof self.cb === 'function')
                self.cb();
              self.emit('upgrade');
            }
          });
        }
        Emitter(Socketiop2p.prototype);
        Socketiop2p.prototype.setupPeerEvents = function(peer) {
          var self = this;
          peer.on('connect', function(peer) {
            self.emit('peer_ready', peer);
          });
          peer.on('data', function(data) {
            if (this.destroyed)
              return;
            self.decoder.add(data);
          });
          peer.on('stream', function(stream) {
            self.emit('stream', stream);
          });
        };
        Socketiop2p.prototype.on = function(type, listener) {
          var self = this;
          this.socket.addEventListener(type, function(data) {
            emitfn.call(self, type, data);
          });
          this.addEventListener(type, listener);
        };
        Socketiop2p.prototype.emit = function(data, cb) {
          var self = this;
          var argsObj = cb || {};
          var encoder = new parser.Encoder();
          if (this._peerEvents.hasOwnProperty(data) || argsObj.fromSocket) {
            emitfn.apply(this, arguments);
          } else if (this.usePeerConnection || !this.useSockets) {
            var args = toArray(arguments);
            var parserType = parser.EVENT;
            if (hasBin(args)) {
              parserType = parser.BINARY_EVENT;
            }
            var packet = {
              type: parserType,
              data: args
            };
            encoder.encode(packet, function(encodedPackets) {
              if (encodedPackets[1] instanceof ArrayBuffer) {
                self._sendArray(encodedPackets);
              } else if (encodedPackets) {
                for (var i = 0; i < encodedPackets.length; i++) {
                  self._send(encodedPackets[i]);
                }
              } else {
                throw new Error('Encoding error');
              }
            });
          } else {
            this.socket.emit(data, cb);
          }
        };
        Socketiop2p.prototype._sendArray = function(arr) {
          var firstPacket = arr[0];
          var interval = 5000;
          var arrLength = arr[1].byteLength;
          var nChunks = Math.ceil(arrLength / interval);
          var packetData = firstPacket.substr(0, 1) + nChunks + firstPacket.substr(firstPacket.indexOf('-'));
          this._send(packetData);
          this.binarySlice(arr[1], interval, this._send);
        };
        Socketiop2p.prototype._send = function(data) {
          var self = this;
          for (var peerId in self._peers) {
            var peer = self._peers[peerId];
            if (peer._channelReady) {
              peer.send(data);
            }
          }
        };
        Socketiop2p.prototype.binarySlice = function(arr, interval, callback) {
          for (var start = 0; start < arr.byteLength; start += interval) {
            var chunk = arr.slice(start, start + interval);
            callback.call(this, chunk);
          }
        };
        Socketiop2p.prototype.ondecoded = function(packet) {
          var args = packet.data || [];
          emitfn.apply(this, args);
        };
        Socketiop2p.prototype.disconnect = function() {
          for (var peerId in this._peers) {
            var peer = this._peers[peerId];
            peer.destroy();
            this.socket.disconnect();
          }
        };
        Socketiop2p.prototype.upgrade = function() {
          this.usePeerConnection = true;
        };
        module.exports = Socketiop2p;
      }, {
        "component-bind": 24,
        "component-emitter": 25,
        "debug": 26,
        "extend.js": 29,
        "has-binary": 30,
        "hat": 32,
        "simple-peer": 34,
        "socket.io-parser": 41,
        "to-array": 47,
        "webrtcsupport": 48
      }],
      24: [function(require, module, exports) {
        var slice = [].slice;
        module.exports = function(obj, fn) {
          if ('string' == typeof fn)
            fn = obj[fn];
          if ('function' != typeof fn)
            throw new Error('bind() requires a function');
          var args = slice.call(arguments, 2);
          return function() {
            return fn.apply(obj, args.concat(slice.call(arguments)));
          };
        };
      }, {}],
      25: [function(require, module, exports) {
        module.exports = Emitter;
        function Emitter(obj) {
          if (obj)
            return mixin(obj);
        }
        ;
        function mixin(obj) {
          for (var key in Emitter.prototype) {
            obj[key] = Emitter.prototype[key];
          }
          return obj;
        }
        Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
          this._callbacks = this._callbacks || {};
          (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
          return this;
        };
        Emitter.prototype.once = function(event, fn) {
          function on() {
            this.off(event, on);
            fn.apply(this, arguments);
          }
          on.fn = fn;
          this.on(event, on);
          return this;
        };
        Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
          this._callbacks = this._callbacks || {};
          if (0 == arguments.length) {
            this._callbacks = {};
            return this;
          }
          var callbacks = this._callbacks['$' + event];
          if (!callbacks)
            return this;
          if (1 == arguments.length) {
            delete this._callbacks['$' + event];
            return this;
          }
          var cb;
          for (var i = 0; i < callbacks.length; i++) {
            cb = callbacks[i];
            if (cb === fn || cb.fn === fn) {
              callbacks.splice(i, 1);
              break;
            }
          }
          return this;
        };
        Emitter.prototype.emit = function(event) {
          this._callbacks = this._callbacks || {};
          var args = [].slice.call(arguments, 1),
              callbacks = this._callbacks['$' + event];
          if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0,
                len = callbacks.length; i < len; ++i) {
              callbacks[i].apply(this, args);
            }
          }
          return this;
        };
        Emitter.prototype.listeners = function(event) {
          this._callbacks = this._callbacks || {};
          return this._callbacks['$' + event] || [];
        };
        Emitter.prototype.hasListeners = function(event) {
          return !!this.listeners(event).length;
        };
      }, {}],
      26: [function(require, module, exports) {
        exports = module.exports = require('./debug');
        exports.log = log;
        exports.formatArgs = formatArgs;
        exports.save = save;
        exports.load = load;
        exports.useColors = useColors;
        exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();
        exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];
        function useColors() {
          return ('WebkitAppearance' in document.documentElement.style) || (window.console && (console.firebug || (console.exception && console.table))) || (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
        }
        exports.formatters.j = function(v) {
          return JSON.stringify(v);
        };
        function formatArgs() {
          var args = arguments;
          var useColors = this.useColors;
          args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);
          if (!useColors)
            return args;
          var c = 'color: ' + this.color;
          args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));
          var index = 0;
          var lastC = 0;
          args[0].replace(/%[a-z%]/g, function(match) {
            if ('%%' === match)
              return;
            index++;
            if ('%c' === match) {
              lastC = index;
            }
          });
          args.splice(lastC, 0, c);
          return args;
        }
        function log() {
          return 'object' === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
        }
        function save(namespaces) {
          try {
            if (null == namespaces) {
              exports.storage.removeItem('debug');
            } else {
              exports.storage.debug = namespaces;
            }
          } catch (e) {}
        }
        function load() {
          var r;
          try {
            r = exports.storage.debug;
          } catch (e) {}
          return r;
        }
        exports.enable(load());
        function localstorage() {
          try {
            return window.localStorage;
          } catch (e) {}
        }
      }, {"./debug": 27}],
      27: [function(require, module, exports) {
        exports = module.exports = debug;
        exports.coerce = coerce;
        exports.disable = disable;
        exports.enable = enable;
        exports.enabled = enabled;
        exports.humanize = require('ms');
        exports.names = [];
        exports.skips = [];
        exports.formatters = {};
        var prevColor = 0;
        var prevTime;
        function selectColor() {
          return exports.colors[prevColor++ % exports.colors.length];
        }
        function debug(namespace) {
          function disabled() {}
          disabled.enabled = false;
          function enabled() {
            var self = enabled;
            var curr = +new Date();
            var ms = curr - (prevTime || curr);
            self.diff = ms;
            self.prev = prevTime;
            self.curr = curr;
            prevTime = curr;
            if (null == self.useColors)
              self.useColors = exports.useColors();
            if (null == self.color && self.useColors)
              self.color = selectColor();
            var args = Array.prototype.slice.call(arguments);
            args[0] = exports.coerce(args[0]);
            if ('string' !== typeof args[0]) {
              args = ['%o'].concat(args);
            }
            var index = 0;
            args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
              if (match === '%%')
                return match;
              index++;
              var formatter = exports.formatters[format];
              if ('function' === typeof formatter) {
                var val = args[index];
                match = formatter.call(self, val);
                args.splice(index, 1);
                index--;
              }
              return match;
            });
            if ('function' === typeof exports.formatArgs) {
              args = exports.formatArgs.apply(self, args);
            }
            var logFn = enabled.log || exports.log || console.log.bind(console);
            logFn.apply(self, args);
          }
          enabled.enabled = true;
          var fn = exports.enabled(namespace) ? enabled : disabled;
          fn.namespace = namespace;
          return fn;
        }
        function enable(namespaces) {
          exports.save(namespaces);
          var split = (namespaces || '').split(/[\s,]+/);
          var len = split.length;
          for (var i = 0; i < len; i++) {
            if (!split[i])
              continue;
            namespaces = split[i].replace(/\*/g, '.*?');
            if (namespaces[0] === '-') {
              exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
            } else {
              exports.names.push(new RegExp('^' + namespaces + '$'));
            }
          }
        }
        function disable() {
          exports.enable('');
        }
        function enabled(name) {
          var i,
              len;
          for (i = 0, len = exports.skips.length; i < len; i++) {
            if (exports.skips[i].test(name)) {
              return false;
            }
          }
          for (i = 0, len = exports.names.length; i < len; i++) {
            if (exports.names[i].test(name)) {
              return true;
            }
          }
          return false;
        }
        function coerce(val) {
          if (val instanceof Error)
            return val.stack || val.message;
          return val;
        }
      }, {"ms": 28}],
      28: [function(require, module, exports) {
        var s = 1000;
        var m = s * 60;
        var h = m * 60;
        var d = h * 24;
        var y = d * 365.25;
        module.exports = function(val, options) {
          options = options || {};
          if ('string' == typeof val)
            return parse(val);
          return options.long ? long(val) : short(val);
        };
        function parse(str) {
          str = '' + str;
          if (str.length > 10000)
            return;
          var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
          if (!match)
            return;
          var n = parseFloat(match[1]);
          var type = (match[2] || 'ms').toLowerCase();
          switch (type) {
            case 'years':
            case 'year':
            case 'yrs':
            case 'yr':
            case 'y':
              return n * y;
            case 'days':
            case 'day':
            case 'd':
              return n * d;
            case 'hours':
            case 'hour':
            case 'hrs':
            case 'hr':
            case 'h':
              return n * h;
            case 'minutes':
            case 'minute':
            case 'mins':
            case 'min':
            case 'm':
              return n * m;
            case 'seconds':
            case 'second':
            case 'secs':
            case 'sec':
            case 's':
              return n * s;
            case 'milliseconds':
            case 'millisecond':
            case 'msecs':
            case 'msec':
            case 'ms':
              return n;
          }
        }
        function short(ms) {
          if (ms >= d)
            return Math.round(ms / d) + 'd';
          if (ms >= h)
            return Math.round(ms / h) + 'h';
          if (ms >= m)
            return Math.round(ms / m) + 'm';
          if (ms >= s)
            return Math.round(ms / s) + 's';
          return ms + 'ms';
        }
        function long(ms) {
          return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
        }
        function plural(ms, n, name) {
          if (ms < n)
            return;
          if (ms < n * 1.5)
            return Math.floor(ms / n) + ' ' + name;
          return Math.ceil(ms / n) + ' ' + name + 's';
        }
      }, {}],
      29: [function(require, module, exports) {
        module.exports = function(src) {
          var objs = [].slice.call(arguments, 1),
              obj;
          for (var i = 0,
              len = objs.length; i < len; i++) {
            obj = objs[i];
            for (var prop in obj) {
              src[prop] = obj[prop];
            }
          }
          return src;
        };
      }, {}],
      30: [function(require, module, exports) {
        (function(global) {
          var isArray = require('isarray');
          module.exports = hasBinary;
          function hasBinary(data) {
            function _hasBinary(obj) {
              if (!obj)
                return false;
              if ((global.Buffer && global.Buffer.isBuffer(obj)) || (global.ArrayBuffer && obj instanceof ArrayBuffer) || (global.Blob && obj instanceof Blob) || (global.File && obj instanceof File)) {
                return true;
              }
              if (isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                  if (_hasBinary(obj[i])) {
                    return true;
                  }
                }
              } else if (obj && 'object' == typeof obj) {
                if (obj.toJSON) {
                  obj = obj.toJSON();
                }
                for (var key in obj) {
                  if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
                    return true;
                  }
                }
              }
              return false;
            }
            return _hasBinary(data);
          }
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, {"isarray": 31}],
      31: [function(require, module, exports) {
        arguments[4][8][0].apply(exports, arguments);
      }, {"dup": 8}],
      32: [function(require, module, exports) {
        var hat = module.exports = function(bits, base) {
          if (!base)
            base = 16;
          if (bits === undefined)
            bits = 128;
          if (bits <= 0)
            return '0';
          var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
          for (var i = 2; digits === Infinity; i *= 2) {
            digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
          }
          var rem = digits - Math.floor(digits);
          var res = '';
          for (var i = 0; i < Math.floor(digits); i++) {
            var x = Math.floor(Math.random() * base).toString(base);
            res = x + res;
          }
          if (rem) {
            var b = Math.pow(base, rem);
            var x = Math.floor(Math.random() * b).toString(base);
            res = x + res;
          }
          var parsed = parseInt(res, base);
          if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
            return hat(bits, base);
          } else
            return res;
        };
        hat.rack = function(bits, base, expandBy) {
          var fn = function(data) {
            var iters = 0;
            do {
              if (iters++ > 10) {
                if (expandBy)
                  bits += expandBy;
                else
                  throw new Error('too many ID collisions, use more bits');
              }
              var id = hat(bits, base);
            } while (Object.hasOwnProperty.call(hats, id));
            hats[id] = data;
            return id;
          };
          var hats = fn.hats = {};
          fn.get = function(id) {
            return fn.hats[id];
          };
          fn.set = function(id, value) {
            fn.hats[id] = value;
            return fn;
          };
          fn.bits = bits || 128;
          fn.base = base || 16;
          return fn;
        };
      }, {}],
      33: [function(require, module, exports) {
        arguments[4][7][0].apply(exports, arguments);
      }, {"dup": 7}],
      34: [function(require, module, exports) {
        (function(Buffer) {
          module.exports = Peer;
          var debug = require('debug')('simple-peer');
          var getBrowserRTC = require('get-browser-rtc');
          var hat = require('hat');
          var inherits = require('inherits');
          var isTypedArray = require('is-typedarray');
          var once = require('once');
          var stream = require('stream');
          var toBuffer = require('typedarray-to-buffer');
          inherits(Peer, stream.Duplex);
          function Peer(opts) {
            var self = this;
            if (!(self instanceof Peer))
              return new Peer(opts);
            self._debug('new peer %o', opts);
            if (!opts)
              opts = {};
            opts.allowHalfOpen = false;
            if (opts.highWaterMark == null)
              opts.highWaterMark = 1024 * 1024;
            stream.Duplex.call(self, opts);
            self.initiator = opts.initiator || false;
            self.channelConfig = opts.channelConfig || Peer.channelConfig;
            self.channelName = opts.channelName || hat(160);
            if (!opts.initiator)
              self.channelName = null;
            self.config = opts.config || Peer.config;
            self.constraints = opts.constraints || Peer.constraints;
            self.reconnectTimer = opts.reconnectTimer || 0;
            self.sdpTransform = opts.sdpTransform || function(sdp) {
              return sdp;
            };
            self.stream = opts.stream || false;
            self.trickle = opts.trickle !== undefined ? opts.trickle : true;
            self.destroyed = false;
            self.connected = false;
            self.remoteAddress = undefined;
            self.remoteFamily = undefined;
            self.remotePort = undefined;
            self.localAddress = undefined;
            self.localPort = undefined;
            self._wrtc = opts.wrtc || getBrowserRTC();
            if (!self._wrtc) {
              if (typeof window === 'undefined') {
                throw new Error('No WebRTC support: Specify `opts.wrtc` option in this environment');
              } else {
                throw new Error('No WebRTC support: Not a supported browser');
              }
            }
            self._maxBufferedAmount = opts.highWaterMark;
            self._pcReady = false;
            self._channelReady = false;
            self._iceComplete = false;
            self._channel = null;
            self._pendingCandidates = [];
            self._chunk = null;
            self._cb = null;
            self._interval = null;
            self._reconnectTimeout = null;
            self._pc = new (self._wrtc.RTCPeerConnection)(self.config, self.constraints);
            self._pc.oniceconnectionstatechange = self._onIceConnectionStateChange.bind(self);
            self._pc.onsignalingstatechange = self._onSignalingStateChange.bind(self);
            self._pc.onicecandidate = self._onIceCandidate.bind(self);
            if (self.stream)
              self._pc.addStream(self.stream);
            self._pc.onaddstream = self._onAddStream.bind(self);
            if (self.initiator) {
              self._setupData({channel: self._pc.createDataChannel(self.channelName, self.channelConfig)});
              self._pc.onnegotiationneeded = once(self._createOffer.bind(self));
              if (typeof window === 'undefined' || !window.webkitRTCPeerConnection) {
                self._pc.onnegotiationneeded();
              }
            } else {
              self._pc.ondatachannel = self._setupData.bind(self);
            }
            self.on('finish', function() {
              if (self.connected) {
                setTimeout(function() {
                  self._destroy();
                }, 100);
              } else {
                self.once('connect', function() {
                  setTimeout(function() {
                    self._destroy();
                  }, 100);
                });
              }
            });
          }
          Peer.WEBRTC_SUPPORT = !!getBrowserRTC();
          Peer.config = {iceServers: [{
              url: 'stun:23.21.150.121',
              urls: 'stun:23.21.150.121'
            }]};
          Peer.constraints = {};
          Peer.channelConfig = {};
          Object.defineProperty(Peer.prototype, 'bufferSize', {get: function() {
              var self = this;
              return (self._channel && self._channel.bufferedAmount) || 0;
            }});
          Peer.prototype.address = function() {
            var self = this;
            return {
              port: self.localPort,
              family: 'IPv4',
              address: self.localAddress
            };
          };
          Peer.prototype.signal = function(data) {
            var self = this;
            if (self.destroyed)
              throw new Error('cannot signal after peer is destroyed');
            if (typeof data === 'string') {
              try {
                data = JSON.parse(data);
              } catch (err) {
                data = {};
              }
            }
            self._debug('signal()');
            function addIceCandidate(candidate) {
              try {
                self._pc.addIceCandidate(new self._wrtc.RTCIceCandidate(candidate), noop, self._onError.bind(self));
              } catch (err) {
                self._destroy(new Error('error adding candidate: ' + err.message));
              }
            }
            if (data.sdp) {
              self._pc.setRemoteDescription(new (self._wrtc.RTCSessionDescription)(data), function() {
                if (self.destroyed)
                  return;
                if (self._pc.remoteDescription.type === 'offer')
                  self._createAnswer();
                self._pendingCandidates.forEach(addIceCandidate);
                self._pendingCandidates = [];
              }, self._onError.bind(self));
            }
            if (data.candidate) {
              if (self._pc.remoteDescription)
                addIceCandidate(data.candidate);
              else
                self._pendingCandidates.push(data.candidate);
            }
            if (!data.sdp && !data.candidate) {
              self._destroy(new Error('signal() called with invalid signal data'));
            }
          };
          Peer.prototype.send = function(chunk) {
            var self = this;
            if (!isTypedArray.strict(chunk) && !(chunk instanceof ArrayBuffer) && !Buffer.isBuffer(chunk) && typeof chunk !== 'string' && (typeof Blob === 'undefined' || !(chunk instanceof Blob))) {
              chunk = JSON.stringify(chunk);
            }
            if (Buffer.isBuffer(chunk) && !isTypedArray.strict(chunk)) {
              chunk = new Uint8Array(chunk);
            }
            var len = chunk.length || chunk.byteLength || chunk.size;
            self._channel.send(chunk);
            self._debug('write: %d bytes', len);
          };
          Peer.prototype.destroy = function(onclose) {
            var self = this;
            self._destroy(null, onclose);
          };
          Peer.prototype._destroy = function(err, onclose) {
            var self = this;
            if (self.destroyed)
              return;
            if (onclose)
              self.once('close', onclose);
            self._debug('destroy (error: %s)', err && err.message);
            self.readable = self.writable = false;
            if (!self._readableState.ended)
              self.push(null);
            if (!self._writableState.finished)
              self.end();
            self.destroyed = true;
            self.connected = false;
            self._pcReady = false;
            self._channelReady = false;
            self._chunk = null;
            self._cb = null;
            clearInterval(self._interval);
            clearTimeout(self._reconnectTimeout);
            if (self._pc) {
              try {
                self._pc.close();
              } catch (err) {}
              self._pc.oniceconnectionstatechange = null;
              self._pc.onsignalingstatechange = null;
              self._pc.onicecandidate = null;
            }
            if (self._channel) {
              try {
                self._channel.close();
              } catch (err) {}
              self._channel.onmessage = null;
              self._channel.onopen = null;
              self._channel.onclose = null;
            }
            self._pc = null;
            self._channel = null;
            if (err)
              self.emit('error', err);
            self.emit('close');
          };
          Peer.prototype._setupData = function(event) {
            var self = this;
            self._channel = event.channel;
            self.channelName = self._channel.label;
            self._channel.binaryType = 'arraybuffer';
            self._channel.onmessage = self._onChannelMessage.bind(self);
            self._channel.onopen = self._onChannelOpen.bind(self);
            self._channel.onclose = self._onChannelClose.bind(self);
          };
          Peer.prototype._read = function() {};
          Peer.prototype._write = function(chunk, encoding, cb) {
            var self = this;
            if (self.destroyed)
              return cb(new Error('cannot write after peer is destroyed'));
            if (self.connected) {
              try {
                self.send(chunk);
              } catch (err) {
                return self._onError(err);
              }
              if (self._channel.bufferedAmount > self._maxBufferedAmount) {
                self._debug('start backpressure: bufferedAmount %d', self._channel.bufferedAmount);
                self._cb = cb;
              } else {
                cb(null);
              }
            } else {
              self._debug('write before connect');
              self._chunk = chunk;
              self._cb = cb;
            }
          };
          Peer.prototype._createOffer = function() {
            var self = this;
            if (self.destroyed)
              return;
            self._pc.createOffer(function(offer) {
              if (self.destroyed)
                return;
              offer.sdp = self.sdpTransform(offer.sdp);
              self._pc.setLocalDescription(offer, noop, self._onError.bind(self));
              var sendOffer = function() {
                var signal = self._pc.localDescription || offer;
                self._debug('signal');
                self.emit('signal', {
                  type: signal.type,
                  sdp: signal.sdp
                });
              };
              if (self.trickle || self._iceComplete)
                sendOffer();
              else
                self.once('_iceComplete', sendOffer);
            }, self._onError.bind(self), self.offerConstraints);
          };
          Peer.prototype._createAnswer = function() {
            var self = this;
            if (self.destroyed)
              return;
            self._pc.createAnswer(function(answer) {
              if (self.destroyed)
                return;
              answer.sdp = self.sdpTransform(answer.sdp);
              self._pc.setLocalDescription(answer, noop, self._onError.bind(self));
              var sendAnswer = function() {
                var signal = self._pc.localDescription || answer;
                self._debug('signal');
                self.emit('signal', {
                  type: signal.type,
                  sdp: signal.sdp
                });
              };
              if (self.trickle || self._iceComplete)
                sendAnswer();
              else
                self.once('_iceComplete', sendAnswer);
            }, self._onError.bind(self), self.answerConstraints);
          };
          Peer.prototype._onIceConnectionStateChange = function() {
            var self = this;
            if (self.destroyed)
              return;
            var iceGatheringState = self._pc.iceGatheringState;
            var iceConnectionState = self._pc.iceConnectionState;
            self._debug('iceConnectionStateChange %s %s', iceGatheringState, iceConnectionState);
            self.emit('iceConnectionStateChange', iceGatheringState, iceConnectionState);
            if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
              clearTimeout(self._reconnectTimeout);
              self._pcReady = true;
              self._maybeReady();
            }
            if (iceConnectionState === 'disconnected') {
              if (self.reconnectTimer) {
                clearTimeout(self._reconnectTimeout);
                self._reconnectTimeout = setTimeout(function() {
                  self._destroy();
                }, self.reconnectTimer);
              } else {
                self._destroy();
              }
            }
            if (iceConnectionState === 'closed') {
              self._destroy();
            }
          };
          Peer.prototype._maybeReady = function() {
            var self = this;
            self._debug('maybeReady pc %s channel %s', self._pcReady, self._channelReady);
            if (self.connected || self._connecting || !self._pcReady || !self._channelReady)
              return;
            self._connecting = true;
            if (typeof window !== 'undefined' && !!window.mozRTCPeerConnection) {
              self._pc.getStats(null, function(res) {
                var items = [];
                res.forEach(function(item) {
                  items.push(item);
                });
                onStats(items);
              }, self._onError.bind(self));
            } else {
              self._pc.getStats(function(res) {
                var items = [];
                res.result().forEach(function(result) {
                  var item = {};
                  result.names().forEach(function(name) {
                    item[name] = result.stat(name);
                  });
                  item.id = result.id;
                  item.type = result.type;
                  item.timestamp = result.timestamp;
                  items.push(item);
                });
                onStats(items);
              });
            }
            function onStats(items) {
              items.forEach(function(item) {
                if (item.type === 'remotecandidate') {
                  self.remoteAddress = item.ipAddress;
                  self.remoteFamily = 'IPv4';
                  self.remotePort = Number(item.portNumber);
                  self._debug('connect remote: %s:%s (%s)', self.remoteAddress, self.remotePort, self.remoteFamily);
                } else if (item.type === 'localcandidate' && item.candidateType === 'host') {
                  self.localAddress = item.ipAddress;
                  self.localPort = Number(item.portNumber);
                  self._debug('connect local: %s:%s', self.localAddress, self.localPort);
                }
              });
              self._connecting = false;
              self.connected = true;
              if (self._chunk) {
                try {
                  self.send(self._chunk);
                } catch (err) {
                  return self._onError(err);
                }
                self._chunk = null;
                self._debug('sent chunk from "write before connect"');
                var cb = self._cb;
                self._cb = null;
                cb(null);
              }
              self._interval = setInterval(function() {
                if (!self._cb || !self._channel || self._channel.bufferedAmount > self._maxBufferedAmount)
                  return;
                self._debug('ending backpressure: bufferedAmount %d', self._channel.bufferedAmount);
                var cb = self._cb;
                self._cb = null;
                cb(null);
              }, 150);
              if (self._interval.unref)
                self._interval.unref();
              self._debug('connect');
              self.emit('connect');
            }
          };
          Peer.prototype._onSignalingStateChange = function() {
            var self = this;
            if (self.destroyed)
              return;
            self._debug('signalingStateChange %s', self._pc.signalingState);
            self.emit('signalingStateChange', self._pc.signalingState);
          };
          Peer.prototype._onIceCandidate = function(event) {
            var self = this;
            if (self.destroyed)
              return;
            if (event.candidate && self.trickle) {
              self.emit('signal', {candidate: {
                  candidate: event.candidate.candidate,
                  sdpMLineIndex: event.candidate.sdpMLineIndex,
                  sdpMid: event.candidate.sdpMid
                }});
            } else if (!event.candidate) {
              self._iceComplete = true;
              self.emit('_iceComplete');
            }
          };
          Peer.prototype._onChannelMessage = function(event) {
            var self = this;
            if (self.destroyed)
              return;
            var data = event.data;
            self._debug('read: %d bytes', data.byteLength || data.length);
            if (data instanceof ArrayBuffer) {
              data = toBuffer(new Uint8Array(data));
              self.push(data);
            } else {
              try {
                data = JSON.parse(data);
              } catch (err) {}
              self.emit('data', data);
            }
          };
          Peer.prototype._onChannelOpen = function() {
            var self = this;
            if (self.connected || self.destroyed)
              return;
            self._debug('on channel open');
            self._channelReady = true;
            self._maybeReady();
          };
          Peer.prototype._onChannelClose = function() {
            var self = this;
            if (self.destroyed)
              return;
            self._debug('on channel close');
            self._destroy();
          };
          Peer.prototype._onAddStream = function(event) {
            var self = this;
            if (self.destroyed)
              return;
            self._debug('on add stream');
            self.emit('stream', event.stream);
          };
          Peer.prototype._onError = function(err) {
            var self = this;
            if (self.destroyed)
              return;
            self._debug('error %s', err.message || err);
            self._destroy(err);
          };
          Peer.prototype._debug = function() {
            var self = this;
            var args = [].slice.call(arguments);
            var id = self.channelName && self.channelName.substring(0, 7);
            args[0] = '[' + id + '] ' + args[0];
            debug.apply(null, args);
          };
          function noop() {}
        }).call(this, require('buffer').Buffer);
      }, {
        "buffer": 2,
        "debug": 26,
        "get-browser-rtc": 35,
        "hat": 32,
        "inherits": 33,
        "is-typedarray": 36,
        "once": 38,
        "stream": 21,
        "typedarray-to-buffer": 39
      }],
      35: [function(require, module, exports) {
        module.exports = function getBrowserRTC() {
          if (typeof window === 'undefined')
            return null;
          var wrtc = {
            RTCPeerConnection: window.mozRTCPeerConnection || window.RTCPeerConnection || window.webkitRTCPeerConnection,
            RTCSessionDescription: window.mozRTCSessionDescription || window.RTCSessionDescription || window.webkitRTCSessionDescription,
            RTCIceCandidate: window.mozRTCIceCandidate || window.RTCIceCandidate || window.webkitRTCIceCandidate
          };
          if (!wrtc.RTCPeerConnection)
            return null;
          return wrtc;
        };
      }, {}],
      36: [function(require, module, exports) {
        module.exports = isTypedArray;
        isTypedArray.strict = isStrictTypedArray;
        isTypedArray.loose = isLooseTypedArray;
        var toString = Object.prototype.toString;
        var names = {
          '[object Int8Array]': true,
          '[object Int16Array]': true,
          '[object Int32Array]': true,
          '[object Uint8Array]': true,
          '[object Uint8ClampedArray]': true,
          '[object Uint16Array]': true,
          '[object Uint32Array]': true,
          '[object Float32Array]': true,
          '[object Float64Array]': true
        };
        function isTypedArray(arr) {
          return (isStrictTypedArray(arr) || isLooseTypedArray(arr));
        }
        function isStrictTypedArray(arr) {
          return (arr instanceof Int8Array || arr instanceof Int16Array || arr instanceof Int32Array || arr instanceof Uint8Array || arr instanceof Uint8ClampedArray || arr instanceof Uint16Array || arr instanceof Uint32Array || arr instanceof Float32Array || arr instanceof Float64Array);
        }
        function isLooseTypedArray(arr) {
          return names[toString.call(arr)];
        }
      }, {}],
      37: [function(require, module, exports) {
        module.exports = wrappy;
        function wrappy(fn, cb) {
          if (fn && cb)
            return wrappy(fn)(cb);
          if (typeof fn !== 'function')
            throw new TypeError('need wrapper function');
          Object.keys(fn).forEach(function(k) {
            wrapper[k] = fn[k];
          });
          return wrapper;
          function wrapper() {
            var args = new Array(arguments.length);
            for (var i = 0; i < args.length; i++) {
              args[i] = arguments[i];
            }
            var ret = fn.apply(this, args);
            var cb = args[args.length - 1];
            if (typeof ret === 'function' && ret !== cb) {
              Object.keys(cb).forEach(function(k) {
                ret[k] = cb[k];
              });
            }
            return ret;
          }
        }
      }, {}],
      38: [function(require, module, exports) {
        var wrappy = require('wrappy');
        module.exports = wrappy(once);
        once.proto = once(function() {
          Object.defineProperty(Function.prototype, 'once', {
            value: function() {
              return once(this);
            },
            configurable: true
          });
        });
        function once(fn) {
          var f = function() {
            if (f.called)
              return f.value;
            f.called = true;
            return f.value = fn.apply(this, arguments);
          };
          f.called = false;
          return f;
        }
      }, {"wrappy": 37}],
      39: [function(require, module, exports) {
        (function(Buffer) {
          var isTypedArray = require('is-typedarray').strict;
          module.exports = function(arr) {
            var constructor = Buffer.TYPED_ARRAY_SUPPORT ? Buffer._augment : function(arr) {
              return new Buffer(arr);
            };
            if (arr instanceof Uint8Array) {
              return constructor(arr);
            } else if (arr instanceof ArrayBuffer) {
              return constructor(new Uint8Array(arr));
            } else if (isTypedArray(arr)) {
              return constructor(new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength));
            } else {
              return new Buffer(arr);
            }
          };
        }).call(this, require('buffer').Buffer);
      }, {
        "buffer": 2,
        "is-typedarray": 36
      }],
      40: [function(require, module, exports) {
        (function(global) {
          var isArray = require('isarray');
          var isBuf = require('./is-buffer');
          exports.deconstructPacket = function(packet) {
            var buffers = [];
            var packetData = packet.data;
            function _deconstructPacket(data) {
              if (!data)
                return data;
              if (isBuf(data)) {
                var placeholder = {
                  _placeholder: true,
                  num: buffers.length
                };
                buffers.push(data);
                return placeholder;
              } else if (isArray(data)) {
                var newData = new Array(data.length);
                for (var i = 0; i < data.length; i++) {
                  newData[i] = _deconstructPacket(data[i]);
                }
                return newData;
              } else if ('object' == typeof data && !(data instanceof Date)) {
                var newData = {};
                for (var key in data) {
                  newData[key] = _deconstructPacket(data[key]);
                }
                return newData;
              }
              return data;
            }
            var pack = packet;
            pack.data = _deconstructPacket(packetData);
            pack.attachments = buffers.length;
            return {
              packet: pack,
              buffers: buffers
            };
          };
          exports.reconstructPacket = function(packet, buffers) {
            var curPlaceHolder = 0;
            function _reconstructPacket(data) {
              if (data && data._placeholder) {
                var buf = buffers[data.num];
                return buf;
              } else if (isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                  data[i] = _reconstructPacket(data[i]);
                }
                return data;
              } else if (data && 'object' == typeof data) {
                for (var key in data) {
                  data[key] = _reconstructPacket(data[key]);
                }
                return data;
              }
              return data;
            }
            packet.data = _reconstructPacket(packet.data);
            packet.attachments = undefined;
            return packet;
          };
          exports.removeBlobs = function(data, callback) {
            function _removeBlobs(obj, curKey, containingObject) {
              if (!obj)
                return obj;
              if ((global.Blob && obj instanceof Blob) || (global.File && obj instanceof File)) {
                pendingBlobs++;
                var fileReader = new FileReader();
                fileReader.onload = function() {
                  if (containingObject) {
                    containingObject[curKey] = this.result;
                  } else {
                    bloblessData = this.result;
                  }
                  if (!--pendingBlobs) {
                    callback(bloblessData);
                  }
                };
                fileReader.readAsArrayBuffer(obj);
              } else if (isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                  _removeBlobs(obj[i], i, obj);
                }
              } else if (obj && 'object' == typeof obj && !isBuf(obj)) {
                for (var key in obj) {
                  _removeBlobs(obj[key], key, obj);
                }
              }
            }
            var pendingBlobs = 0;
            var bloblessData = data;
            _removeBlobs(bloblessData);
            if (!pendingBlobs) {
              callback(bloblessData);
            }
          };
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, {
        "./is-buffer": 42,
        "isarray": 45
      }],
      41: [function(require, module, exports) {
        var debug = require('debug')('socket.io-parser');
        var json = require('json3');
        var isArray = require('isarray');
        var Emitter = require('component-emitter');
        var binary = require('./binary');
        var isBuf = require('./is-buffer');
        exports.protocol = 4;
        exports.types = ['CONNECT', 'DISCONNECT', 'EVENT', 'BINARY_EVENT', 'ACK', 'BINARY_ACK', 'ERROR'];
        exports.CONNECT = 0;
        exports.DISCONNECT = 1;
        exports.EVENT = 2;
        exports.ACK = 3;
        exports.ERROR = 4;
        exports.BINARY_EVENT = 5;
        exports.BINARY_ACK = 6;
        exports.Encoder = Encoder;
        exports.Decoder = Decoder;
        function Encoder() {}
        Encoder.prototype.encode = function(obj, callback) {
          debug('encoding packet %j', obj);
          if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
            encodeAsBinary(obj, callback);
          } else {
            var encoding = encodeAsString(obj);
            callback([encoding]);
          }
        };
        function encodeAsString(obj) {
          var str = '';
          var nsp = false;
          str += obj.type;
          if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
            str += obj.attachments;
            str += '-';
          }
          if (obj.nsp && '/' != obj.nsp) {
            nsp = true;
            str += obj.nsp;
          }
          if (null != obj.id) {
            if (nsp) {
              str += ',';
              nsp = false;
            }
            str += obj.id;
          }
          if (null != obj.data) {
            if (nsp)
              str += ',';
            str += json.stringify(obj.data);
          }
          debug('encoded %j as %s', obj, str);
          return str;
        }
        function encodeAsBinary(obj, callback) {
          function writeEncoding(bloblessData) {
            var deconstruction = binary.deconstructPacket(bloblessData);
            var pack = encodeAsString(deconstruction.packet);
            var buffers = deconstruction.buffers;
            buffers.unshift(pack);
            callback(buffers);
          }
          binary.removeBlobs(obj, writeEncoding);
        }
        function Decoder() {
          this.reconstructor = null;
        }
        Emitter(Decoder.prototype);
        Decoder.prototype.add = function(obj) {
          var packet;
          if ('string' == typeof obj) {
            packet = decodeString(obj);
            if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) {
              this.reconstructor = new BinaryReconstructor(packet);
              if (this.reconstructor.reconPack.attachments == 0) {
                this.emit('decoded', packet);
              }
            } else {
              this.emit('decoded', packet);
            }
          } else if (isBuf(obj) || obj.base64) {
            if (!this.reconstructor) {
              throw new Error('got binary data when not reconstructing a packet');
            } else {
              packet = this.reconstructor.takeBinaryData(obj);
              if (packet) {
                this.reconstructor = null;
                this.emit('decoded', packet);
              }
            }
          } else {
            throw new Error('Unknown type: ' + obj);
          }
        };
        function decodeString(str) {
          var p = {};
          var i = 0;
          p.type = Number(str.charAt(0));
          if (null == exports.types[p.type])
            return error();
          if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
            p.attachments = '';
            while (str.charAt(++i) != '-') {
              p.attachments += str.charAt(i);
            }
            p.attachments = Number(p.attachments);
          }
          if ('/' == str.charAt(i + 1)) {
            p.nsp = '';
            while (++i) {
              var c = str.charAt(i);
              if (',' == c)
                break;
              p.nsp += c;
              if (i + 1 == str.length)
                break;
            }
          } else {
            p.nsp = '/';
          }
          var next = str.charAt(i + 1);
          if ('' != next && Number(next) == next) {
            p.id = '';
            while (++i) {
              var c = str.charAt(i);
              if (null == c || Number(c) != c) {
                --i;
                break;
              }
              p.id += str.charAt(i);
              if (i + 1 == str.length)
                break;
            }
            p.id = Number(p.id);
          }
          if (str.charAt(++i)) {
            try {
              p.data = json.parse(str.substr(i));
            } catch (e) {
              return error();
            }
          }
          debug('decoded %s as %j', str, p);
          return p;
        }
        Decoder.prototype.destroy = function() {
          if (this.reconstructor) {
            this.reconstructor.finishedReconstruction();
          }
        };
        function BinaryReconstructor(packet) {
          this.reconPack = packet;
          this.buffers = [];
        }
        BinaryReconstructor.prototype.takeBinaryData = function(binData) {
          this.buffers.push(binData);
          if (this.buffers.length == this.reconPack.attachments) {
            this.reconPack.data['data'] = this.buffers.reduce(function(prev, curr, idx, arr) {
              return this._appendBuffer(prev, curr);
            });
            binary.reconstructPacket(this.reconPack, [this.reconPack.data['data']]);
            var packet = this.reconPack;
            this.finishedReconstruction();
            return packet;
          }
          return null;
        };
        BinaryReconstructor.prototype.finishedReconstruction = function() {
          this.reconPack = null;
          this.buffers = [];
        };
        function error(data) {
          return {
            type: exports.ERROR,
            data: 'parser error'
          };
        }
        BinaryReconstructor.prototype._appendBuffer = function(curr, prev) {
          var tmp = new Uint8Array(curr.byteLength + prev.byteLength);
          tmp.set(new Uint8Array(curr), 0);
          tmp.set(new Uint8Array(prev), curr.byteLength);
          return tmp.buffer;
        };
      }, {
        "./binary": 40,
        "./is-buffer": 42,
        "component-emitter": 43,
        "debug": 44,
        "isarray": 45,
        "json3": 46
      }],
      42: [function(require, module, exports) {
        (function(global) {
          module.exports = isBuf;
          function isBuf(obj) {
            return (global.Buffer && global.Buffer.isBuffer(obj)) || (global.ArrayBuffer && obj instanceof ArrayBuffer);
          }
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, {}],
      43: [function(require, module, exports) {
        module.exports = Emitter;
        function Emitter(obj) {
          if (obj)
            return mixin(obj);
        }
        ;
        function mixin(obj) {
          for (var key in Emitter.prototype) {
            obj[key] = Emitter.prototype[key];
          }
          return obj;
        }
        Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
          this._callbacks = this._callbacks || {};
          (this._callbacks[event] = this._callbacks[event] || []).push(fn);
          return this;
        };
        Emitter.prototype.once = function(event, fn) {
          var self = this;
          this._callbacks = this._callbacks || {};
          function on() {
            self.off(event, on);
            fn.apply(this, arguments);
          }
          on.fn = fn;
          this.on(event, on);
          return this;
        };
        Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
          this._callbacks = this._callbacks || {};
          if (0 == arguments.length) {
            this._callbacks = {};
            return this;
          }
          var callbacks = this._callbacks[event];
          if (!callbacks)
            return this;
          if (1 == arguments.length) {
            delete this._callbacks[event];
            return this;
          }
          var cb;
          for (var i = 0; i < callbacks.length; i++) {
            cb = callbacks[i];
            if (cb === fn || cb.fn === fn) {
              callbacks.splice(i, 1);
              break;
            }
          }
          return this;
        };
        Emitter.prototype.emit = function(event) {
          this._callbacks = this._callbacks || {};
          var args = [].slice.call(arguments, 1),
              callbacks = this._callbacks[event];
          if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0,
                len = callbacks.length; i < len; ++i) {
              callbacks[i].apply(this, args);
            }
          }
          return this;
        };
        Emitter.prototype.listeners = function(event) {
          this._callbacks = this._callbacks || {};
          return this._callbacks[event] || [];
        };
        Emitter.prototype.hasListeners = function(event) {
          return !!this.listeners(event).length;
        };
      }, {}],
      44: [function(require, module, exports) {
        module.exports = debug;
        function debug(name) {
          if (!debug.enabled(name))
            return function() {};
          return function(fmt) {
            fmt = coerce(fmt);
            var curr = new Date;
            var ms = curr - (debug[name] || curr);
            debug[name] = curr;
            fmt = name + ' ' + fmt + ' +' + debug.humanize(ms);
            window.console && console.log && Function.prototype.apply.call(console.log, console, arguments);
          };
        }
        debug.names = [];
        debug.skips = [];
        debug.enable = function(name) {
          try {
            localStorage.debug = name;
          } catch (e) {}
          var split = (name || '').split(/[\s,]+/),
              len = split.length;
          for (var i = 0; i < len; i++) {
            name = split[i].replace('*', '.*?');
            if (name[0] === '-') {
              debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
            } else {
              debug.names.push(new RegExp('^' + name + '$'));
            }
          }
        };
        debug.disable = function() {
          debug.enable('');
        };
        debug.humanize = function(ms) {
          var sec = 1000,
              min = 60 * 1000,
              hour = 60 * min;
          if (ms >= hour)
            return (ms / hour).toFixed(1) + 'h';
          if (ms >= min)
            return (ms / min).toFixed(1) + 'm';
          if (ms >= sec)
            return (ms / sec | 0) + 's';
          return ms + 'ms';
        };
        debug.enabled = function(name) {
          for (var i = 0,
              len = debug.skips.length; i < len; i++) {
            if (debug.skips[i].test(name)) {
              return false;
            }
          }
          for (var i = 0,
              len = debug.names.length; i < len; i++) {
            if (debug.names[i].test(name)) {
              return true;
            }
          }
          return false;
        };
        function coerce(val) {
          if (val instanceof Error)
            return val.stack || val.message;
          return val;
        }
        try {
          if (window.localStorage)
            debug.enable(localStorage.debug);
        } catch (e) {}
      }, {}],
      45: [function(require, module, exports) {
        arguments[4][8][0].apply(exports, arguments);
      }, {"dup": 8}],
      46: [function(require, module, exports) {
        ;
        (function(window) {
          var getClass = {}.toString,
              isProperty,
              forEach,
              undef;
          var isLoader = typeof define === "function" && define.amd;
          var nativeJSON = typeof JSON == "object" && JSON;
          var JSON3 = typeof exports == "object" && exports && !exports.nodeType && exports;
          if (JSON3 && nativeJSON) {
            JSON3.stringify = nativeJSON.stringify;
            JSON3.parse = nativeJSON.parse;
          } else {
            JSON3 = window.JSON = nativeJSON || {};
          }
          var isExtended = new Date(-3509827334573292);
          try {
            isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 && isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
          } catch (exception) {}
          function has(name) {
            if (has[name] !== undef) {
              return has[name];
            }
            var isSupported;
            if (name == "bug-string-char-index") {
              isSupported = "a"[0] != "a";
            } else if (name == "json") {
              isSupported = has("json-stringify") && has("json-parse");
            } else {
              var value,
                  serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
              if (name == "json-stringify") {
                var stringify = JSON3.stringify,
                    stringifySupported = typeof stringify == "function" && isExtended;
                if (stringifySupported) {
                  (value = function() {
                    return 1;
                  }).toJSON = value;
                  try {
                    stringifySupported = stringify(0) === "0" && stringify(new Number()) === "0" && stringify(new String()) == '""' && stringify(getClass) === undef && stringify(undef) === undef && stringify() === undef && stringify(value) === "1" && stringify([value]) == "[1]" && stringify([undef]) == "[null]" && stringify(null) == "null" && stringify([undef, getClass, null]) == "[null,null,null]" && stringify({"a": [value, true, false, null, "\x00\b\n\f\r\t"]}) == serialized && stringify(null, value) === "1" && stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" && stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' && stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' && stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' && stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
                  } catch (exception) {
                    stringifySupported = false;
                  }
                }
                isSupported = stringifySupported;
              }
              if (name == "json-parse") {
                var parse = JSON3.parse;
                if (typeof parse == "function") {
                  try {
                    if (parse("0") === 0 && !parse(false)) {
                      value = parse(serialized);
                      var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                      if (parseSupported) {
                        try {
                          parseSupported = !parse('"\t"');
                        } catch (exception) {}
                        if (parseSupported) {
                          try {
                            parseSupported = parse("01") !== 1;
                          } catch (exception) {}
                        }
                        if (parseSupported) {
                          try {
                            parseSupported = parse("1.") !== 1;
                          } catch (exception) {}
                        }
                      }
                    }
                  } catch (exception) {
                    parseSupported = false;
                  }
                }
                isSupported = parseSupported;
              }
            }
            return has[name] = !!isSupported;
          }
          if (!has("json")) {
            var functionClass = "[object Function]";
            var dateClass = "[object Date]";
            var numberClass = "[object Number]";
            var stringClass = "[object String]";
            var arrayClass = "[object Array]";
            var booleanClass = "[object Boolean]";
            var charIndexBuggy = has("bug-string-char-index");
            if (!isExtended) {
              var floor = Math.floor;
              var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
              var getDay = function(year, month) {
                return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
              };
            }
            if (!(isProperty = {}.hasOwnProperty)) {
              isProperty = function(property) {
                var members = {},
                    constructor;
                if ((members.__proto__ = null, members.__proto__ = {"toString": 1}, members).toString != getClass) {
                  isProperty = function(property) {
                    var original = this.__proto__,
                        result = property in (this.__proto__ = null, this);
                    this.__proto__ = original;
                    return result;
                  };
                } else {
                  constructor = members.constructor;
                  isProperty = function(property) {
                    var parent = (this.constructor || constructor).prototype;
                    return property in this && !(property in parent && this[property] === parent[property]);
                  };
                }
                members = null;
                return isProperty.call(this, property);
              };
            }
            var PrimitiveTypes = {
              'boolean': 1,
              'number': 1,
              'string': 1,
              'undefined': 1
            };
            var isHostType = function(object, property) {
              var type = typeof object[property];
              return type == 'object' ? !!object[property] : !PrimitiveTypes[type];
            };
            forEach = function(object, callback) {
              var size = 0,
                  Properties,
                  members,
                  property;
              (Properties = function() {
                this.valueOf = 0;
              }).prototype.valueOf = 0;
              members = new Properties();
              for (property in members) {
                if (isProperty.call(members, property)) {
                  size++;
                }
              }
              Properties = members = null;
              if (!size) {
                members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
                forEach = function(object, callback) {
                  var isFunction = getClass.call(object) == functionClass,
                      property,
                      length;
                  var hasProperty = !isFunction && typeof object.constructor != 'function' && isHostType(object, 'hasOwnProperty') ? object.hasOwnProperty : isProperty;
                  for (property in object) {
                    if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                      callback(property);
                    }
                  }
                  for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property))
                    ;
                };
              } else if (size == 2) {
                forEach = function(object, callback) {
                  var members = {},
                      isFunction = getClass.call(object) == functionClass,
                      property;
                  for (property in object) {
                    if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                      callback(property);
                    }
                  }
                };
              } else {
                forEach = function(object, callback) {
                  var isFunction = getClass.call(object) == functionClass,
                      property,
                      isConstructor;
                  for (property in object) {
                    if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                      callback(property);
                    }
                  }
                  if (isConstructor || isProperty.call(object, (property = "constructor"))) {
                    callback(property);
                  }
                };
              }
              return forEach(object, callback);
            };
            if (!has("json-stringify")) {
              var Escapes = {
                92: "\\\\",
                34: '\\"',
                8: "\\b",
                12: "\\f",
                10: "\\n",
                13: "\\r",
                9: "\\t"
              };
              var leadingZeroes = "000000";
              var toPaddedString = function(width, value) {
                return (leadingZeroes + (value || 0)).slice(-width);
              };
              var unicodePrefix = "\\u00";
              var quote = function(value) {
                var result = '"',
                    index = 0,
                    length = value.length,
                    isLarge = length > 10 && charIndexBuggy,
                    symbols;
                if (isLarge) {
                  symbols = value.split("");
                }
                for (; index < length; index++) {
                  var charCode = value.charCodeAt(index);
                  switch (charCode) {
                    case 8:
                    case 9:
                    case 10:
                    case 12:
                    case 13:
                    case 34:
                    case 92:
                      result += Escapes[charCode];
                      break;
                    default:
                      if (charCode < 32) {
                        result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                        break;
                      }
                      result += isLarge ? symbols[index] : charIndexBuggy ? value.charAt(index) : value[index];
                  }
                }
                return result + '"';
              };
              var serialize = function(property, object, callback, properties, whitespace, indentation, stack) {
                var value,
                    className,
                    year,
                    month,
                    date,
                    time,
                    hours,
                    minutes,
                    seconds,
                    milliseconds,
                    results,
                    element,
                    index,
                    length,
                    prefix,
                    result;
                try {
                  value = object[property];
                } catch (exception) {}
                if (typeof value == "object" && value) {
                  className = getClass.call(value);
                  if (className == dateClass && !isProperty.call(value, "toJSON")) {
                    if (value > -1 / 0 && value < 1 / 0) {
                      if (getDay) {
                        date = floor(value / 864e5);
                        for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++)
                          ;
                        for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++)
                          ;
                        date = 1 + date - getDay(year, month);
                        time = (value % 864e5 + 864e5) % 864e5;
                        hours = floor(time / 36e5) % 24;
                        minutes = floor(time / 6e4) % 60;
                        seconds = floor(time / 1e3) % 60;
                        milliseconds = time % 1e3;
                      } else {
                        year = value.getUTCFullYear();
                        month = value.getUTCMonth();
                        date = value.getUTCDate();
                        hours = value.getUTCHours();
                        minutes = value.getUTCMinutes();
                        seconds = value.getUTCSeconds();
                        milliseconds = value.getUTCMilliseconds();
                      }
                      value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) + "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) + "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) + "." + toPaddedString(3, milliseconds) + "Z";
                    } else {
                      value = null;
                    }
                  } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
                    value = value.toJSON(property);
                  }
                }
                if (callback) {
                  value = callback.call(object, property, value);
                }
                if (value === null) {
                  return "null";
                }
                className = getClass.call(value);
                if (className == booleanClass) {
                  return "" + value;
                } else if (className == numberClass) {
                  return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
                } else if (className == stringClass) {
                  return quote("" + value);
                }
                if (typeof value == "object") {
                  for (length = stack.length; length--; ) {
                    if (stack[length] === value) {
                      throw TypeError();
                    }
                  }
                  stack.push(value);
                  results = [];
                  prefix = indentation;
                  indentation += whitespace;
                  if (className == arrayClass) {
                    for (index = 0, length = value.length; index < length; index++) {
                      element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                      results.push(element === undef ? "null" : element);
                    }
                    result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
                  } else {
                    forEach(properties || value, function(property) {
                      var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                      if (element !== undef) {
                        results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                      }
                    });
                    result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
                  }
                  stack.pop();
                  return result;
                }
              };
              JSON3.stringify = function(source, filter, width) {
                var whitespace,
                    callback,
                    properties,
                    className;
                if (typeof filter == "function" || typeof filter == "object" && filter) {
                  if ((className = getClass.call(filter)) == functionClass) {
                    callback = filter;
                  } else if (className == arrayClass) {
                    properties = {};
                    for (var index = 0,
                        length = filter.length,
                        value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1))
                      ;
                  }
                }
                if (width) {
                  if ((className = getClass.call(width)) == numberClass) {
                    if ((width -= width % 1) > 0) {
                      for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ")
                        ;
                    }
                  } else if (className == stringClass) {
                    whitespace = width.length <= 10 ? width : width.slice(0, 10);
                  }
                }
                return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
              };
            }
            if (!has("json-parse")) {
              var fromCharCode = String.fromCharCode;
              var Unescapes = {
                92: "\\",
                34: '"',
                47: "/",
                98: "\b",
                116: "\t",
                110: "\n",
                102: "\f",
                114: "\r"
              };
              var Index,
                  Source;
              var abort = function() {
                Index = Source = null;
                throw SyntaxError();
              };
              var lex = function() {
                var source = Source,
                    length = source.length,
                    value,
                    begin,
                    position,
                    isSigned,
                    charCode;
                while (Index < length) {
                  charCode = source.charCodeAt(Index);
                  switch (charCode) {
                    case 9:
                    case 10:
                    case 13:
                    case 32:
                      Index++;
                      break;
                    case 123:
                    case 125:
                    case 91:
                    case 93:
                    case 58:
                    case 44:
                      value = charIndexBuggy ? source.charAt(Index) : source[Index];
                      Index++;
                      return value;
                    case 34:
                      for (value = "@", Index++; Index < length; ) {
                        charCode = source.charCodeAt(Index);
                        if (charCode < 32) {
                          abort();
                        } else if (charCode == 92) {
                          charCode = source.charCodeAt(++Index);
                          switch (charCode) {
                            case 92:
                            case 34:
                            case 47:
                            case 98:
                            case 116:
                            case 110:
                            case 102:
                            case 114:
                              value += Unescapes[charCode];
                              Index++;
                              break;
                            case 117:
                              begin = ++Index;
                              for (position = Index + 4; Index < position; Index++) {
                                charCode = source.charCodeAt(Index);
                                if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                                  abort();
                                }
                              }
                              value += fromCharCode("0x" + source.slice(begin, Index));
                              break;
                            default:
                              abort();
                          }
                        } else {
                          if (charCode == 34) {
                            break;
                          }
                          charCode = source.charCodeAt(Index);
                          begin = Index;
                          while (charCode >= 32 && charCode != 92 && charCode != 34) {
                            charCode = source.charCodeAt(++Index);
                          }
                          value += source.slice(begin, Index);
                        }
                      }
                      if (source.charCodeAt(Index) == 34) {
                        Index++;
                        return value;
                      }
                      abort();
                    default:
                      begin = Index;
                      if (charCode == 45) {
                        isSigned = true;
                        charCode = source.charCodeAt(++Index);
                      }
                      if (charCode >= 48 && charCode <= 57) {
                        if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                          abort();
                        }
                        isSigned = false;
                        for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++)
                          ;
                        if (source.charCodeAt(Index) == 46) {
                          position = ++Index;
                          for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++)
                            ;
                          if (position == Index) {
                            abort();
                          }
                          Index = position;
                        }
                        charCode = source.charCodeAt(Index);
                        if (charCode == 101 || charCode == 69) {
                          charCode = source.charCodeAt(++Index);
                          if (charCode == 43 || charCode == 45) {
                            Index++;
                          }
                          for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++)
                            ;
                          if (position == Index) {
                            abort();
                          }
                          Index = position;
                        }
                        return +source.slice(begin, Index);
                      }
                      if (isSigned) {
                        abort();
                      }
                      if (source.slice(Index, Index + 4) == "true") {
                        Index += 4;
                        return true;
                      } else if (source.slice(Index, Index + 5) == "false") {
                        Index += 5;
                        return false;
                      } else if (source.slice(Index, Index + 4) == "null") {
                        Index += 4;
                        return null;
                      }
                      abort();
                  }
                }
                return "$";
              };
              var get = function(value) {
                var results,
                    hasMembers;
                if (value == "$") {
                  abort();
                }
                if (typeof value == "string") {
                  if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
                    return value.slice(1);
                  }
                  if (value == "[") {
                    results = [];
                    for (; ; hasMembers || (hasMembers = true)) {
                      value = lex();
                      if (value == "]") {
                        break;
                      }
                      if (hasMembers) {
                        if (value == ",") {
                          value = lex();
                          if (value == "]") {
                            abort();
                          }
                        } else {
                          abort();
                        }
                      }
                      if (value == ",") {
                        abort();
                      }
                      results.push(get(value));
                    }
                    return results;
                  } else if (value == "{") {
                    results = {};
                    for (; ; hasMembers || (hasMembers = true)) {
                      value = lex();
                      if (value == "}") {
                        break;
                      }
                      if (hasMembers) {
                        if (value == ",") {
                          value = lex();
                          if (value == "}") {
                            abort();
                          }
                        } else {
                          abort();
                        }
                      }
                      if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                        abort();
                      }
                      results[value.slice(1)] = get(lex());
                    }
                    return results;
                  }
                  abort();
                }
                return value;
              };
              var update = function(source, property, callback) {
                var element = walk(source, property, callback);
                if (element === undef) {
                  delete source[property];
                } else {
                  source[property] = element;
                }
              };
              var walk = function(source, property, callback) {
                var value = source[property],
                    length;
                if (typeof value == "object" && value) {
                  if (getClass.call(value) == arrayClass) {
                    for (length = value.length; length--; ) {
                      update(value, length, callback);
                    }
                  } else {
                    forEach(value, function(property) {
                      update(value, property, callback);
                    });
                  }
                }
                return callback.call(source, property, value);
              };
              JSON3.parse = function(source, callback) {
                var result,
                    value;
                Index = 0;
                Source = "" + source;
                result = get(lex());
                if (lex() != "$") {
                  abort();
                }
                Index = Source = null;
                return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
              };
            }
          }
          if (isLoader) {
            define(function() {
              return JSON3;
            });
          }
        }(this));
      }, {}],
      47: [function(require, module, exports) {
        module.exports = toArray;
        function toArray(list, index) {
          var array = [];
          index = index || 0;
          for (var i = index || 0; i < list.length; i++) {
            array[i - index] = list[i];
          }
          return array;
        }
      }, {}],
      48: [function(require, module, exports) {
        var prefix;
        var version;
        if (window.mozRTCPeerConnection || navigator.mozGetUserMedia) {
          prefix = 'moz';
          version = parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1], 10);
        } else if (window.webkitRTCPeerConnection || navigator.webkitGetUserMedia) {
          prefix = 'webkit';
          version = navigator.userAgent.match(/Chrom(e|ium)/) && parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2], 10);
        }
        var PC = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
        var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
        var MediaStream = window.webkitMediaStream || window.MediaStream;
        var screenSharing = window.location.protocol === 'https:' && ((prefix === 'webkit' && version >= 26) || (prefix === 'moz' && version >= 33));
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var videoEl = document.createElement('video');
        var supportVp8 = videoEl && videoEl.canPlayType && videoEl.canPlayType('video/webm; codecs="vp8", vorbis') === "probably";
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia || navigator.mozGetUserMedia;
        module.exports = {
          prefix: prefix,
          browserVersion: version,
          support: !!PC && supportVp8 && !!getUserMedia,
          supportRTCPeerConnection: !!PC,
          supportVp8: supportVp8,
          supportGetUserMedia: !!getUserMedia,
          supportDataChannel: !!(PC && PC.prototype && PC.prototype.createDataChannel),
          supportWebAudio: !!(AudioContext && AudioContext.prototype.createMediaStreamSource),
          supportMediaStream: !!(MediaStream && MediaStream.prototype.removeTrack),
          supportScreenSharing: !!screenSharing,
          AudioContext: AudioContext,
          PeerConnection: PC,
          SessionDescription: SessionDescription,
          IceCandidate: IceCandidate,
          MediaStream: MediaStream,
          getUserMedia: getUserMedia
        };
      }, {}]
    }, {}, [23])(23);
  });
})(require('buffer').Buffer, require('process'));
