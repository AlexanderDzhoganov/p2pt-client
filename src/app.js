import p2p from 'socket.io-p2p'
import io from 'socket.io-client'

import Dropzone from 'dropzone'

import FileReader from './filereader'
import Downloader from './downloader'

import Config from './config'
var config = new Config()

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

  constructor() {
    this.serverUrl = config.serverUrl
    this.isFirstVisit = !localStorage.firstVisit

    Dropzone.autoDiscover = false
    Dropzone.autoProcessQueue = false

    var hash = location.hash.trim()

    if(hash.length !== 0) {
      if(!hash.startsWith('#/')) {
        this.reload()
        return
      }

      hash = hash.slice(2)

      this.isUploader = false
      this.token = hash.slice(0, 16)
      this.secret = hash.slice(16, 32)
    }

    this.socket = io(config.apiUrl, {
      transports: ['websocket']
    })

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

    this.socket.on('set-token-ok', token => {
      this.token = token
      this.initPeerToPeer()
    }.bind(this))
  }

  bind() {
    if(this.isUploader) {
      localStorage.firstVisit = true
      this.initDropzone()
    } else {
      this.downloader = new Downloader()

      window.onbeforeunload = () => {
        return 'There is a download in progress, are you sure you wish to cancel it?'
      }
    }
  }

  createClientSecret() {
    if (!window.crypto || !window.crypto.getRandomValues) {
      throw 'prng not available'
    }

    var randValues = new Uint32Array(2)
    window.crypto.getRandomValues(randValues)
    var secret = randValues[0].toString(16) + randValues[1].toString(16)
    return secret
  }

  initPeerToPeer() {
    if(this.isUploader) {
      this.secret = this.createClientSecret()
      this.secretVerified = false
    }

    this.p2p = new p2p(this.socket, config.p2pConfig)

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
      this.invalidSecret = !this.secretVerified

      if(this.file && !this.uploading && this.secretVerified) {
        this.startUpload()
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
            this.hashMismatch = 'SHA-1 mismatch, got "' + 
              this.downloader.fileHash + '", expected "' + 
              packet.fileHash + '"'
          }

          window.onbeforeunload = null
        })
      }
    }.bind(this))
  }

  initDropzone() {
    var view = this

    setTimeout(() => {
      this.dropzone = new Dropzone(this.dropzoneRef, {
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
    
    if(this.noSecureRandom) { // fail hard if we have no secure random source
      this.userAgent = navigator.userAgent
      return
    }

    this.fileName = file.name.split('\\').pop()

    this.file = file
    this.reader = new FileReader(this.file)
    this.socket.emit('ask-token') // got a file, time to ask the backend for a token
  }

  startUpload() {
    if(!this.file || !this.connectedToPeer || !this.secretVerified) {
      return
    }

    this.uploading = true
    window.onbeforeunload = () => {
      return 'There is an upload in progress, are you sure you wish to cancel it?'
    }

    this.reader.readCallback = (data, complete) => {
      this.p2p.emit('data', {
        fileName: this.fileName,
        fileSize: this.reader.fileSize,
        chunk: data,
        complete: complete,
        fileHash: this.reader.fileHash,
        chunkId: this.chunkId++
      })

      this.uploadComplete = complete
    }.bind(this)

    setTimeout(() => { // hacky but this allows WebRTC some time to initialize or something
      this.reader.loadNextChunk() // otherwise the first request always goes missing
    }.bind(this), 1000)
  }

  reload() {
    window.onbeforeunload = null
    location.hash = ''
    location.reload()
  }

}
