import CryptoJS from 'crypto-js'

var CONST_1GiB = 1024 * 1024 * 1024
var CONST_8GiB = 1024 * 1024 * 1024 * 8

var CONST_CHUNK_SIZE = 65536

export default class Reader {

    constructor(file) {
      this.file = file
      this.largeFile = false
      this.veryLargeFile = false

      this.pos = 0
      this.fileSize = 0
      this.percentComplete = 0

      this.sha1 = CryptoJS.algo.SHA1.create()
      this.fileHash = null

      this.reader = new FileReader()

      this.reader.onload = () => {
        this.fileSize = this.file.size
        if(this.fileSize > CONST_1GiB) {
          this.largeFile = true
        }

        if(this.fileSize > CONST_8GiB) {
          this.veryLargeFile = true
        }

        this.reader.onload = e => {
          this.onChunkLoaded()
        }.bind(this)
      }.bind(this)

      // dummy 1 byte read so we can get the file size
      this.reader.readAsArrayBuffer(this.file.slice(0, 1))
    }

    onChunkLoaded() {
      this.fileSize = this.file.size

      var data = this.reader.result

      this.pos += data.byteLength
      this.percentComplete = (this.pos / this.fileSize) * 100.0
      var complete = this.pos >= this.fileSize

      this.sha1.update(CryptoJS.lib.WordArray.create(new Uint8Array(data)))

      if(complete) {
        this.fileHash = this.sha1.finalize().toString()
      }

      this.readCallback && this.readCallback(data, complete)
    }

    loadNextChunk() {
      this.reader.readAsArrayBuffer(this.file.slice(this.pos, this.pos + CONST_CHUNK_SIZE));
    }

}
