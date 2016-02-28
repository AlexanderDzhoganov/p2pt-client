import _ from 'lodash'
import mimetype from 'mimetype'

import CryptoJS from 'crypto-js'

export default class Downloader {

    constructor() {
      this.fileName = null
      this.fileSize = 0
      this.chunks = {}
      this.bytesTransferred = 0
      this.complete = false
      this.percentComplete = 0
      this.localUrl = null
    }

    setFileInfo(fileName, fileSize) {
      this.fileName = fileName
      this.fileSize = fileSize
    }

    addChunk(chunkId, chunk) {
      this.chunks[chunkId] = chunk
      this.bytesTransferred += chunk.byteLength
      this.percentComplete = (this.bytesTransferred / this.fileSize) * 100.0
    }

    setComplete(fileHash) {
      this.complete = false

      var chunkList = []
      for(var i = 0; i < _.keys(this.chunks).length; i++) {
        chunkList.push(this.chunks[i])
      }

      var sha1 = CryptoJS.algo.SHA1.create()
      _.each(chunkList, chunk => {
        sha1.update(CryptoJS.lib.WordArray.create(new Uint8Array(chunk)))
      })

      this.fileHash = sha1.finalize().toString()
      if(this.fileHash !== fileHash) {
        return false
      }

      var blob = new Blob(chunkList, { type: mimetype.lookup(this.fileName) })
      this.localUrl = window.URL.createObjectURL(blob)
      this.complete = true
      return true
    }

}
