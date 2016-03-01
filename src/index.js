import {inject} from 'aurelia-framework'
import {Router} from 'aurelia-router'

import p2p from 'socket.io-p2p'
import io from 'socket.io-client'

import lodash from 'lodash'
import $ from 'jquery'
import Dropzone from 'dropzone'
import CryptoJS from 'crypto-js'

import filereader from './filereader'
import downloader from './downloader'

import Config from './config'

@inject(Router)
export class Index {

  isUploader = true
  connectedToPeer = false
  token = null
  secret = null
  secretVerified = false

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

    if(!localStorage.notifications) {
      localStorage.notifications = JSON.stringify({
        improv_security: false
      })
    }

    this.notifications = JSON.parse(localStorage.notifications)
    this.isFirstVisit = !localStorage.firstVisit
  }

  activate(params) {
    if(params.token) {
      this.isUploader = false
      this.token = params.token.slice(0, 16)
      this.secret = params.token.slice(16)
    }
  }

  bind() {
    if(this.isUploader) {
      localStorage.firstVisit = true
      this.initDropzone()
    } else {
      window.onbeforeunload = () => {
        return 'There is a download in progress, are you sure you wish to cancel it?'
      }
    }

    this.socket = io(this.config.apiUrl)
  
    this.socket.on('connect', () => {
      this.connectionError = false

      if(this.token) {
        this.socket.emit('set-token', this.token)
      }
    }.bind(this))

    this.socket.on('connect_error', () => {
      this.connectionError = true
    }.bind(this))

    this.socket.on('connect_timeout', () => {
      this.connectionError = true
    }.bind(this))

    this.socket.on('error', err => {
      console.error(err)
    }.bind(this))

    this.socket.on('set-token-invalid', () => {
      this.reload()
    }.bind(this))

    this.socket.on('total-transfers', val => {
      this.totalTransfers = val
    }.bind(this))

    function generateSecret() {
      if (!window.crypto || !window.crypto.getRandomValues) {
        throw 'prng not available'
      }

      var randValues = new Uint32Array(2)
      window.crypto.getRandomValues(randValues)
      var secret = randValues[0].toString(16) + randValues[1].toString(16)
      return secret
    }

    this.socket.on('set-token-ok', token => {
      this.token = token

      if(this.isUploader) {
        this.secret = generateSecret()
        this.secretVerified = false
      }

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
        if(this.connectedToPeer && !this.isUploader) {
          this.p2p.emit('verify-secret', this.secret)
        }

        this.connectedToPeer = true
      }.bind(this))

      this.p2p.on('peer-error', err => {
        console.error(err)
        this.connectedToPeer = false
      }.bind(this))

      this.p2p.on('error', err => {
        console.error(err)
        this.connectedToPeer = false
      }.bind(this))

      this.p2p.on('verify-secret', secret => {
        this.secretVerified = secret === this.secret
        this.invalidSecret = false

        if(this.file && !this.uploading && this.secretVerified) {
          this.startUpload()
        } else if(!this.secretVerified) {
          this.invalidSecret = true
        }
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
    this.noSecureRandom = window.crypto === undefined || 
      window.crypto.getRandomValues === undefined
    
    if(this.noSecureRandom) {
      this.userAgent = navigator.userAgent
      return
    }

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
    window.onbeforeunload = null
    this.router.navigate('/')
    location.reload()
  }

  hideNotification(name) {
    this.notifications[name] = true
    localStorage.notifications = JSON.stringify(this.notifications)
  }

}
