import _ from 'lodash'
import mimetype from 'mimetype'

import CryptoJS from 'crypto-js'

export default class Downloader {

    constructor() {
      this.fileName = null
      this.fileSize = 0
      this.chunks = []
      this.bytesTransferred = 0
      this.complete = false
      this.percentComplete = 0
      this.localUrl = null

      this.hasher = CryptoJS.algo.SHA1.create()
    }

    setFileInfo(fileName, fileSize) {
      this.fileName = fileName
      this.fileSize = fileSize
    }

    addChunk(chunk) {
      this.hasher.update(CryptoJS.lib.WordArray.create(new Uint8Array(chunk)))
      this.chunks.push(chunk)
      this.bytesTransferred += chunk.byteLength
      this.percentComplete = (this.bytesTransferred / this.fileSize) * 100.0
    }

    setComplete(fileHash) {
      this.complete = false

      this.fileHash = this.hasher.finalize().toString()
      if(this.fileHash !== fileHash) {
        return false
      }

      var blob = new Blob(this.chunks, { type: mimetype.lookup(this.fileName) })
      this.localUrl = window.URL.createObjectURL(blob)
      this.complete = true
      return true
    }

}
