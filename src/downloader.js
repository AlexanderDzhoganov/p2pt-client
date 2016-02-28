import _ from 'lodash'
import mimetype from 'mimetype'

import CryptoJS from 'crypto-js'

export default class Downloader {

    constructor() {
      this.fileName = null
      this.fileSize = 0
      this.chunks = []
      this.nextChunkId = 0

      this.bytesTransferred = 0
      this.complete = false
      this.validated = false
      this.valdatedChunks = 0
      this.chunksPerCall = 16
      this.percentComplete = 0
      this.localUrl = null
    }

    setFileInfo(fileName, fileSize) {
      this.fileName = fileName
      this.fileSize = fileSize
    }

    addChunk(chunkId, chunk) {
      if(this.nextChunkId !== chunkId) {
        console.error('out of order chunk')
      }

      this.nextChunkId++

      this.chunks.push(chunk)
      this.bytesTransferred += chunk.byteLength
      this.percentComplete = (this.bytesTransferred / this.fileSize) * 100.0
    }

    validateNextChunkBatch() {
      var i = this.chunksPerCall

      while(i > 0) {
        if(!this.validateNextChunk()) {
          return
        }

        i--
      }

      setTimeout(() => {
        this.validateNextChunkBatch()
      }.bind(this), 0)
    }

    validateNextChunk() {
      this.sha1.update(CryptoJS.lib.WordArray.create(new Uint8Array(this.chunks[this.validatedChunks])))
      this.validatedChunks++
      this.percentComplete = (this.validatedChunks / this.chunks.length) * 100.0
      
      if(this.validatedChunks >= this.chunks.length) {
        this.fileHash = this.sha1.finalize().toString()
        if(this.fileHash !== this.expectedFileHash) {
          this.completeCb(false)
          return false
        }

        var blob = new Blob(this.chunks, { type: mimetype.lookup(this.fileName) })
        this.localUrl = window.URL.createObjectURL(blob)
        this.validated = true
        this.completeCb(true)
        return false
      }

      return true
    }

    setComplete(fileHash, completeCb) {
      this.completeCb = completeCb
      this.complete = false

      this.sha1 = CryptoJS.algo.SHA1.create()
      this.expectedFileHash = fileHash

      this.validated = false
      this.validatedChunks = 0
      this.complete = true
      this.percentComplete = 0
      this.validateNextChunkBatch()
    }

}
