import p2p from 'socket.io-p2p'
import io from 'socket.io-client'

import lodash from 'lodash'

import filereader from './filereader'
import downloader from './downloader'

export class Index {

  connected = false
  connectedToPeer = false

  token = null
  tokenAccepted = false

  files = null
  uploading = false

  downloader = null

  constructor() {
    this.downloader = new downloader()
  }

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

      if (this.files && this.files[0]) {
        this.startUpload()
      }
    }.bind(this))

    this.p2p.on('error', err => {
      console.error(err)
      this.connectedToPeer = false
    }.bind(this))

    this.p2p.on('data', packet => {
      this.downloader.addChunk(packet.fileName, packet.fileSize, packet.data)
    }.bind(this))

    this.socket.on('connect', () => {
      this.connected = true
      if(this.token) {
        this.socket.emit('set-token', this.token)
      }
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

  startUpload() {
    if(!this.files || !this.connectedToPeer) {
      return
    }

    this.uploading = true
    
    var fileName = this.fileName.split('\\').pop()

    this.reader = new filereader(this.files[0])
    this.reader.readFile(function(data, complete) {
      this.p2p.emit('data', {
        fileName: fileName,
        fileSize: this.reader.fileSize,
        position: this.reader.pos,
        size: data.byteLength,
        data: data
      })

      if(complete) {
        this.uploading = false
      }
    }.bind(this))
  }

  askToken() {
    if(!this.connected) {
      return
    }

    this.socket.emit('ask-token')
  }

}
