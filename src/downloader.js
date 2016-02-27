import _ from 'lodash'
import mimetype from 'mimetype'

export default class Downloader {

    constructor() {
      this.queue = []
    }

    addChunk(fileName, fileSize, chunk, complete) {
      var download = _.find(this.queue, dl => dl.fileName == fileName)
      if(!download) {
        this.queue.push({
          fileName: fileName,
          fileSize: fileSize,
          chunks: [chunk],
          bytesTransferred: chunk.byteLength,
          complete: complete
        })

        download = this.queue[this.queue.length - 1]
      } else {
        download.chunks.push(chunk)
        download.bytesTransferred += chunk.byteLength
        download.fileSize = fileSize
        download.complete = complete
      }

      download.percentComplete = (download.bytesTransferred / download.fileSize) * 100.0

      if (download.complete) {
        var blob = new Blob(download.chunks, { type: mimetype.lookup(download.fileName) })
        download.localUrl = window.URL.createObjectURL(blob)
      }
    }

}
