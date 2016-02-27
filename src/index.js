import p2p from 'socket.io-p2p'
import io from 'socket.io-client'

import lodash from 'lodash'
import $ from 'jquery'
import Dropzone from 'dropzone'

import filereader from './filereader'
import downloader from './downloader'

export class Index {

  isUploader = true
  connectedToPeer = false

  token = null

  file = null
  uploading = false

  downloader = null

  constructor() {
    this.downloader = new downloader()
    this.downloader.onDownloadComplete = download => {
      console.log('DOWNLOAD READY')
    }.bind(this)
  }

  activate(params) {
    if(params.token) {
      this.isUploader = false
      this.token = params.token
    }
  }

  bind() {
    Dropzone.autoDiscover = false
    Dropzone.autoProcessQueue = false

    var view = this

    Dropzone.options.dropzone = {
      init: function() {
        this.on("addedfile", file => {
          view.fileAdded(file)
        }.bind(this))
      },
      autoDiscover: false,
      autoProcessQueue: false
    };

    setTimeout(() => {
      this.dropzone = new Dropzone("div#dropzone", { url: "/file/post"})
    }.bind(this), 0)

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
      this.downloader.addChunk(packet.fileName, packet.fileSize, packet.data)
    }.bind(this))

    this.socket.on('connect', () => {
      if(this.token) {
        this.socket.emit('set-token', this.token)
      }
    }.bind(this))

    this.socket.on('error', err => {
      console.error(err)
    }.bind(this))

    this.socket.on('set-token-ok', token => {
      this.token = token
    }.bind(this))
  }

  fileAdded(file) {
    this.fileName = file.name
    this.contentType = file.type
    this.file = file
    this.socket.emit('ask-token')
  }

  startUpload() {
    if(!this.file || !this.connectedToPeer) {
      return
    }

    this.uploading = true
    var fileName = this.fileName.split('\\').pop()

    this.reader = new filereader(this.file)
    this.reader.readFile(function(data, complete) {
      this.p2p.emit('data', {
        fileName: fileName,
        fileSize: this.reader.fileSize,
        position: this.reader.pos,
        size: data.byteLength,
        data: data
      })

      if(complete) {
        this.uploadComplete = true
      }
    }.bind(this))
  }

}
