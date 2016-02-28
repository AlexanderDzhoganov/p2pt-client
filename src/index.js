import {inject} from 'aurelia-framework'
import {Router} from 'aurelia-router'

import p2p from 'socket.io-p2p'
import io from 'socket.io-client'

import lodash from 'lodash'
import $ from 'jquery'
import Dropzone from 'dropzone'

import filereader from './filereader'
import downloader from './downloader'

import Config from './config'

@inject(Router)
export class Index {

  isUploader = true
  connectedToPeer = false
  token = null
  file = null
  uploading = false
  uploadComplete = false
  chunkId = 0
  downloader = null
  hashMismatch = null

  totalTransfers = 0

  constructor(router) {
    this.router = router
    Dropzone.autoDiscover = false
    Dropzone.autoProcessQueue = false
    this.downloader = new downloader()
    this.config = new Config()
    this.serverUrl = this.config.serverUrl
  }

  activate(params) {
    if(params.token) {
      this.isUploader = false
      this.token = params.token
    }
  }

  bind() {
    if(this.isUploader) {
      this.initDropzone()
    } else {
      window.onbeforeunload = () => {
        return 'There is a download in progress, are you sure you wish to cancel it?'
      }
    }

    this.socket = io(this.config.apiUrl)
  
    this.socket.on('connect', () => {
      if(this.token) {
        this.socket.emit('set-token', this.token)
      }
    }.bind(this))

    this.socket.on('error', err => {
      console.error(err)
    }.bind(this))

    this.socket.on('set-token-invalid', () => {
      this.router.navigate('/')
      location.reload()
    }.bind(this))

    this.socket.on('total-transfers', val => {
      this.totalTransfers = val
    }.bind(this))

    this.socket.on('set-token-ok', token => {
      this.token = token

      this.p2p = new p2p(this.socket, {
        peerOpts: {
          trickle: false,
          config: {
            "iceServers": [
              {
                "url": "stun:23.21.150.121",
                "urls": "stun:23.21.150.121"
              }
            ]
          }
        }
      })

      this.p2p.on('ready', function() {
        this.p2p.usePeerConnection = true
      }.bind(this))

      this.p2p.on('upgrade', data => {
        this.connectedToPeer = true

        if (this.file && !this.uploading) {
          this.startUpload()
        }
      }.bind(this))

      this.p2p.on('peer-error', err => {
        console.error(err)
        this.connectedToPeer = false
      }.bind(this))

      this.p2p.on('error', err => {
        console.error(err)
        this.connectedToPeer = false
      }.bind(this))

      this.p2p.on('got-chunk', packet => {
        if(packet.chunkId !== this.chunkId - 1) {
          console.error('chunks out of order')
        }

        if(!this.uploadComplete) {
          this.reader.loadNextChunk()
        } else {
          window.onbeforeunload = null
        }
      }.bind(this))

      this.p2p.on('data', packet => {
        this.downloader.setFileInfo(packet.fileName, packet.fileSize)
        this.downloader.addChunk(packet.chunkId, packet.chunk)

        this.p2p.emit('got-chunk', { chunkId: packet.chunkId })

        if (packet.complete) {
          this.downloader.setComplete(packet.fileHash, success => {
            if(!success) {
              this.hashMismatch = 'SHA-1 mismatch, got "' + this.downloader.fileHash + '", expected "' + packet.fileHash + '"'
            }

            window.onbeforeunload = null
          })
        }
      }.bind(this))
    }.bind(this))
  }

  initDropzone() {
    var view = this

    setTimeout(() => {
      this.dropzone = new Dropzone("div#dropzone", {
        url: "bitf.ly",
        addedfile: file => {
          view.fileAdded(file)
        }.bind(this),
        thumbnail: (file, dataUrl) => {
        }.bind(this),
        uploadprogress: () => {},
        autoProcessQueue: false,
        maxFiles: 1
      })
    }.bind(this), 0)
  }

  fileAdded(file) {
    $('#dropzone-text').html(file.name)
    this.fileName = file.name
    this.contentType = file.type
    this.file = file
    this.reader = new filereader(this.file)
    this.socket.emit('ask-token')
  }

  startUpload() {
    if(!this.file || !this.connectedToPeer) {
      return
    }

    this.uploading = true
    window.onbeforeunload = () => {
      return 'There is an upload in progress, are you sure you wish to cancel it?'
    }

    this.reader.readCallback = (data, complete) => {
      this.sendChunk(data, complete)
    }.bind(this)

    setTimeout(() => {
      this.reader.loadNextChunk()
    }.bind(this), 1000)
  }

  sendChunk(data, complete) {
    var fileName = this.fileName.split('\\').pop()

    var packet = {
      fileName: fileName,
      fileSize: this.reader.fileSize,
      chunk: data,
      complete: complete,
      fileHash: this.reader.fileHash,
      chunkId: this.chunkId
    }

    this.chunkId++
    this.p2p.emit('data', packet)

    if(complete) {
      this.uploadComplete = true
    }
  }

  reload() {
    this.router.navigate('/')
    location.reload()
  }

}
