import CryptoJS from 'crypto-js'

export default class Reader {

    constructor(file) {
      this.file = file
      this.chunkSize = 65536
      this.pos = 0
      this.fileSize = 0
      this.percentComplete = 0

      this.fileHasher = CryptoJS.algo.SHA1.create()
      this.fileHash = null

      this.reader = new FileReader()
      this.reader.onload = function(e) {
        this.onChunkLoaded()
      }.bind(this)
    }

    onChunkLoaded() {
      this.fileSize = this.file.size

      var data = this.reader.result

      this.pos += data.byteLength
      this.percentComplete = (this.pos / this.fileSize) * 100.0
      var complete = this.pos >= this.fileSize

      this.fileHasher.update(CryptoJS.lib.WordArray.create(new Uint8Array(data)))

      if(complete) {
        this.fileHash = this.fileHasher.finalize().toString()
      }

      if(this.readCallback) {
        this.readCallback(data, complete)
      }
    }

    loadNextChunk() {
      this.reader.readAsArrayBuffer(this.file.slice(this.pos, this.pos + this.chunkSize));
    }

}
