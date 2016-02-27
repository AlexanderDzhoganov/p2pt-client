import p2p from 'socket.io-p2p'
import io from 'socket.io-client'

import lodash from 'lodash'
import mimetype from 'mimetype'

export class Index {

  connected = false
  connectedToPeer = false

  token = null
  tokenAccepted = false

  files = null
  uploading = false

  chunkSize = 16384
  currentPosition = 0
  fileSize = 0

  downloadQueue = []

  activate(params) {
    if(params.token) {
      this.token = params.token
    }
  }

  bind() {
    this.socket = io('http://localhost:3000')

    this.p2p = new p2p(this.socket)

    this.p2p.on('ready', function() {
      this.p2p.usePeerConnection = true
      this.p2p.emit('peer-obj', { peerId: peerId })
    }.bind(this))

    this.p2p.on('upgrade', data => {
      console.log('connection upgraded to webrtc')
      this.connectedToPeer = true

      if (this.file) {
        this.startUpload()
      }
    }.bind(this))

    this.p2p.on('error', err => {
      console.error(err)
      this.connectedToPeer = false
    }.bind(this))

    this.p2p.on('data', packet => {
      var download = _.find(this.downloadQueue, dl => dl.fileName == packet.fileName)
      if(!download) {
        this.downloadQueue.push({
          fileName: packet.fileName,
          fileSize: packet.fileSize,
          chunks: [packet.data],
          bytesTransferred: packet.size,
          complete: packet.size >= packet.fileSize
        })
        download = this.downloadQueue[this.downloadQueue.length - 1]
      } else {
        download.chunks.push(packet.data)
        download.bytesTransferred += packet.size
        download.fileSize = packet.fileSize

        if (download.bytesTransferred >= download.fileSize) {
          download.complete = true
        }
      }

      if (download.complete) {
        var blob = new Blob(download.chunks, { type: mimetype.lookup(download.fileName) })
        download.localUrl = window.URL.createObjectURL(blob)
        console.log('URL: ' + download.localUrl)
      }
    }.bind(this))

    this.socket.on('connect', () => {
      this.connected = true
      this.processToken()
    }.bind(this))

    this.socket.on('error', err => {
      console.error(err)
      this.connected = false
    }.bind(this))

    this.socket.on('set-token-ok', token => {
      this.token = token
      this.tokenAccepted = true
    }.bind(this))
  }

  processToken() {
    if(!this.token) {
      return
    }

    this.socket.emit('set-token', this.token)
  }

  startUpload() {
    if(!this.files || !this.connectedToPeer) {
      return
    }

    this.uploading = true

    this.reader = new FileReader()
    this.reader.onload = function(e) {
      this.onChunkLoaded(e)
    }.bind(this)

    this.loadNextChunk()
  }

  onChunkLoaded(event) {
    this.fileSize = this.files[0].size

    var data = this.reader.result
    var fileName = this.fileName.split('\\').pop()

    console.log('"' + fileName + '" sending chunk @ ' + this.currentPosition + ':' + data.byteLength)

    this.p2p.emit('data', {
      fileName: fileName,
      fileSize: this.fileSize,
      position: this.currentPosition,
      size: data.byteLength,
      data: data
    })

    this.currentPosition += data.byteLength
    if (this.currentPosition < this.fileSize) {
      this.loadNextChunk()
    } else {
      this.uploading = false
    }
  }

  loadNextChunk() {
    this.reader.readAsArrayBuffer(this.files[0].slice(this.currentPosition, 
      this.currentPosition + this.chunkSize));
  }

  askToken() {
    if(!this.connected) {
      return
    }

    this.socket.emit('ask-token')
  }

}
