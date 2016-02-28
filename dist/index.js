System.register(['aurelia-framework', 'aurelia-router', 'socket.io-p2p', 'socket.io-client', 'lodash', 'jquery', 'dropzone', './filereader', './downloader', './config'], function (_export) {
  'use strict';

  var inject, Router, p2p, io, lodash, $, Dropzone, filereader, downloader, Config, Index;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }, function (_socketIoP2p) {
      p2p = _socketIoP2p['default'];
    }, function (_socketIoClient) {
      io = _socketIoClient['default'];
    }, function (_lodash) {
      lodash = _lodash['default'];
    }, function (_jquery) {
      $ = _jquery['default'];
    }, function (_dropzone) {
      Dropzone = _dropzone['default'];
    }, function (_filereader) {
      filereader = _filereader['default'];
    }, function (_downloader) {
      downloader = _downloader['default'];
    }, function (_config) {
      Config = _config['default'];
    }],
    execute: function () {
      Index = (function () {
        function Index(router) {
          _classCallCheck(this, _Index);

          this.isUploader = true;
          this.connectedToPeer = false;
          this.token = null;
          this.file = null;
          this.uploading = false;
          this.uploadComplete = false;
          this.downloader = null;
          this.hashMismatch = null;
          this.totalTransfers = 0;

          this.router = router;
          Dropzone.autoDiscover = false;
          Dropzone.autoProcessQueue = false;
          this.downloader = new downloader();
          this.config = new Config();
          this.serverUrl = this.config.serverUrl;
        }

        _createClass(Index, [{
          key: 'activate',
          value: function activate(params) {
            if (params.token) {
              this.isUploader = false;
              this.token = params.token;
            }
          }
        }, {
          key: 'bind',
          value: function bind() {
            var _this = this;

            if (this.isUploader) {
              this.initDropzone();
            }

            this.socket = io(this.config.apiUrl);

            this.socket.on('connect', (function () {
              if (_this.token) {
                _this.socket.emit('set-token', _this.token);
              }
            }).bind(this));

            this.socket.on('error', (function (err) {
              console.error(err);
            }).bind(this));

            this.socket.on('set-token-invalid', (function () {
              _this.router.navigate('/');
              location.reload();
            }).bind(this));

            this.socket.on('total-transfers', (function (val) {
              _this.totalTransfers = val;
            }).bind(this));

            this.socket.on('set-token-ok', (function (token) {
              _this.token = token;

              _this.p2p = new p2p(_this.socket, {
                peerOpts: {
                  trickle: false,
                  config: {
                    "iceServers": [{
                      "url": "stun:23.21.150.121",
                      "urls": "stun:23.21.150.121"
                    }]
                  }
                }
              });

              _this.p2p.on('ready', (function () {
                this.p2p.usePeerConnection = true;
              }).bind(_this));

              _this.p2p.on('upgrade', (function (data) {
                _this.connectedToPeer = true;

                if (_this.file) {
                  _this.startUpload();
                }
              }).bind(_this));

              _this.p2p.on('peer-error', (function (err) {
                console.error(err);
                _this.connectedToPeer = false;
              }).bind(_this));

              _this.p2p.on('error', (function (err) {
                console.error(err);
                _this.connectedToPeer = false;
              }).bind(_this));

              _this.p2p.on('data', (function (packet) {
                _this.downloader.setFileInfo(packet.fileName, packet.fileSize);
                _this.downloader.addChunk(packet.chunk);

                if (packet.complete) {
                  if (!_this.downloader.setComplete(packet.fileHash)) {
                    _this.hashMismatch = 'SHA-1 mismatch, got "' + _this.downloader.fileHash + '", expected "' + packet.fileHash + '"';
                  }
                }
              }).bind(_this));
            }).bind(this));
          }
        }, {
          key: 'initDropzone',
          value: function initDropzone() {
            var _this2 = this;

            var view = this;

            setTimeout((function () {
              _this2.dropzone = new Dropzone("div#dropzone", {
                url: "bitf.ly",
                addedfile: (function (file) {
                  view.fileAdded(file);
                }).bind(_this2),
                thumbnail: (function (file, dataUrl) {}).bind(_this2),
                uploadprogress: function uploadprogress() {},
                autoProcessQueue: false
              });
            }).bind(this), 0);
          }
        }, {
          key: 'fileAdded',
          value: function fileAdded(file) {
            $('#dropzone-text').html(file.name);
            this.fileName = file.name;
            this.contentType = file.type;
            this.file = file;
            this.socket.emit('ask-token');
          }
        }, {
          key: 'startUpload',
          value: function startUpload() {
            if (!this.file || !this.connectedToPeer) {
              return;
            }

            this.uploading = true;
            var fileName = this.fileName.split('\\').pop();

            this.reader = new filereader(this.file);
            this.reader.readFile((function (data, complete) {
              var packet = {
                fileName: fileName,
                fileSize: this.reader.fileSize,
                chunk: data,
                complete: complete,
                fileHash: this.reader.fileHash
              };

              this.p2p.emit('data', packet);

              if (complete) {
                this.uploadComplete = true;
              }
            }).bind(this));
          }
        }, {
          key: 'reload',
          value: function reload() {
            location.reload();
          }
        }]);

        var _Index = Index;
        Index = inject(Router)(Index) || Index;
        return Index;
      })();

      _export('Index', Index);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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QUFDLElBQUksQ0FBQyxDQUFDLENBQUE7V0FDZDs7O2lCQUVLLGtCQUFHO0FBQ1Asb0JBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtXQUNsQjs7O3FCQWhLVSxLQUFLO0FBQUwsYUFBSyxHQURqQixNQUFNLENBQUMsTUFBTSxDQUFDLENBQ0YsS0FBSyxLQUFMLEtBQUs7ZUFBTCxLQUFLIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpbmplY3R9IGZyb20gJ2F1cmVsaWEtZnJhbWV3b3JrJ1xuaW1wb3J0IHtSb3V0ZXJ9IGZyb20gJ2F1cmVsaWEtcm91dGVyJ1xuXG5pbXBvcnQgcDJwIGZyb20gJ3NvY2tldC5pby1wMnAnXG5pbXBvcnQgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCdcblxuaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknXG5pbXBvcnQgRHJvcHpvbmUgZnJvbSAnZHJvcHpvbmUnXG5cbmltcG9ydCBmaWxlcmVhZGVyIGZyb20gJy4vZmlsZXJlYWRlcidcbmltcG9ydCBkb3dubG9hZGVyIGZyb20gJy4vZG93bmxvYWRlcidcblxuaW1wb3J0IENvbmZpZyBmcm9tICcuL2NvbmZpZydcblxuQGluamVjdChSb3V0ZXIpXG5leHBvcnQgY2xhc3MgSW5kZXgge1xuXG4gIGlzVXBsb2FkZXIgPSB0cnVlXG4gIGNvbm5lY3RlZFRvUGVlciA9IGZhbHNlXG4gIHRva2VuID0gbnVsbFxuICBmaWxlID0gbnVsbFxuICB1cGxvYWRpbmcgPSBmYWxzZVxuICB1cGxvYWRDb21wbGV0ZSA9IGZhbHNlXG4gIGRvd25sb2FkZXIgPSBudWxsXG4gIGhhc2hNaXNtYXRjaCA9IG51bGxcblxuICB0b3RhbFRyYW5zZmVycyA9IDBcblxuICBjb25zdHJ1Y3Rvcihyb3V0ZXIpIHtcbiAgICB0aGlzLnJvdXRlciA9IHJvdXRlclxuICAgIERyb3B6b25lLmF1dG9EaXNjb3ZlciA9IGZhbHNlXG4gICAgRHJvcHpvbmUuYXV0b1Byb2Nlc3NRdWV1ZSA9IGZhbHNlXG4gICAgdGhpcy5kb3dubG9hZGVyID0gbmV3IGRvd25sb2FkZXIoKVxuICAgIHRoaXMuY29uZmlnID0gbmV3IENvbmZpZygpXG4gICAgdGhpcy5zZXJ2ZXJVcmwgPSB0aGlzLmNvbmZpZy5zZXJ2ZXJVcmxcbiAgfVxuXG4gIGFjdGl2YXRlKHBhcmFtcykge1xuICAgIGlmKHBhcmFtcy50b2tlbikge1xuICAgICAgdGhpcy5pc1VwbG9hZGVyID0gZmFsc2VcbiAgICAgIHRoaXMudG9rZW4gPSBwYXJhbXMudG9rZW5cbiAgICB9XG4gIH1cblxuICBiaW5kKCkge1xuICAgIGlmKHRoaXMuaXNVcGxvYWRlcikge1xuICAgICAgdGhpcy5pbml0RHJvcHpvbmUoKVxuICAgIH1cblxuICAgIHRoaXMuc29ja2V0ID0gaW8odGhpcy5jb25maWcuYXBpVXJsKVxuICBcbiAgICB0aGlzLnNvY2tldC5vbignY29ubmVjdCcsICgpID0+IHtcbiAgICAgIGlmKHRoaXMudG9rZW4pIHtcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdCgnc2V0LXRva2VuJywgdGhpcy50b2tlbilcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpXG5cbiAgICB0aGlzLnNvY2tldC5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgdGhpcy5zb2NrZXQub24oJ3NldC10b2tlbi1pbnZhbGlkJywgKCkgPT4ge1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoJy8nKVxuICAgICAgbG9jYXRpb24ucmVsb2FkKClcbiAgICB9LmJpbmQodGhpcykpXG5cbiAgICB0aGlzLnNvY2tldC5vbigndG90YWwtdHJhbnNmZXJzJywgdmFsID0+IHtcbiAgICAgIHRoaXMudG90YWxUcmFuc2ZlcnMgPSB2YWxcbiAgICB9LmJpbmQodGhpcykpXG5cbiAgICB0aGlzLnNvY2tldC5vbignc2V0LXRva2VuLW9rJywgdG9rZW4gPT4ge1xuICAgICAgdGhpcy50b2tlbiA9IHRva2VuXG5cbiAgICAgIHRoaXMucDJwID0gbmV3IHAycCh0aGlzLnNvY2tldCwge1xuICAgICAgICBwZWVyT3B0czoge1xuICAgICAgICAgIHRyaWNrbGU6IGZhbHNlLFxuICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgXCJpY2VTZXJ2ZXJzXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IFwic3R1bjoyMy4yMS4xNTAuMTIxXCIsXG4gICAgICAgICAgICAgICAgXCJ1cmxzXCI6IFwic3R1bjoyMy4yMS4xNTAuMTIxXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdGhpcy5wMnAub24oJ3JlYWR5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucDJwLnVzZVBlZXJDb25uZWN0aW9uID0gdHJ1ZVxuICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICB0aGlzLnAycC5vbigndXBncmFkZScsIGRhdGEgPT4ge1xuICAgICAgICB0aGlzLmNvbm5lY3RlZFRvUGVlciA9IHRydWVcblxuICAgICAgICBpZiAodGhpcy5maWxlKSB7XG4gICAgICAgICAgdGhpcy5zdGFydFVwbG9hZCgpXG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSlcblxuICAgICAgdGhpcy5wMnAub24oJ3BlZXItZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgdGhpcy5jb25uZWN0ZWRUb1BlZXIgPSBmYWxzZVxuICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICB0aGlzLnAycC5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgdGhpcy5jb25uZWN0ZWRUb1BlZXIgPSBmYWxzZVxuICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICB0aGlzLnAycC5vbignZGF0YScsIHBhY2tldCA9PiB7XG4gICAgICAgIHRoaXMuZG93bmxvYWRlci5zZXRGaWxlSW5mbyhwYWNrZXQuZmlsZU5hbWUsIHBhY2tldC5maWxlU2l6ZSlcbiAgICAgICAgdGhpcy5kb3dubG9hZGVyLmFkZENodW5rKHBhY2tldC5jaHVuaylcblxuICAgICAgICBpZiAocGFja2V0LmNvbXBsZXRlKSB7XG4gICAgICAgICAgaWYoIXRoaXMuZG93bmxvYWRlci5zZXRDb21wbGV0ZShwYWNrZXQuZmlsZUhhc2gpKSB7XG4gICAgICAgICAgICB0aGlzLmhhc2hNaXNtYXRjaCA9ICdTSEEtMSBtaXNtYXRjaCwgZ290IFwiJyArIHRoaXMuZG93bmxvYWRlci5maWxlSGFzaCArICdcIiwgZXhwZWN0ZWQgXCInICsgcGFja2V0LmZpbGVIYXNoICsgJ1wiJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKVxuICAgIH0uYmluZCh0aGlzKSlcbiAgfVxuXG4gIGluaXREcm9wem9uZSgpIHtcbiAgICB2YXIgdmlldyA9IHRoaXNcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5kcm9wem9uZSA9IG5ldyBEcm9wem9uZShcImRpdiNkcm9wem9uZVwiLCB7XG4gICAgICAgIHVybDogXCJiaXRmLmx5XCIsXG4gICAgICAgIGFkZGVkZmlsZTogZmlsZSA9PiB7XG4gICAgICAgICAgdmlldy5maWxlQWRkZWQoZmlsZSlcbiAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICB0aHVtYm5haWw6IChmaWxlLCBkYXRhVXJsKSA9PiB7XG4gICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgdXBsb2FkcHJvZ3Jlc3M6ICgpID0+IHt9LFxuICAgICAgICBhdXRvUHJvY2Vzc1F1ZXVlOiBmYWxzZVxuICAgICAgfSlcbiAgICB9LmJpbmQodGhpcyksIDApXG4gIH1cblxuICBmaWxlQWRkZWQoZmlsZSkge1xuICAgICQoJyNkcm9wem9uZS10ZXh0JykuaHRtbChmaWxlLm5hbWUpXG4gICAgdGhpcy5maWxlTmFtZSA9IGZpbGUubmFtZVxuICAgIHRoaXMuY29udGVudFR5cGUgPSBmaWxlLnR5cGVcbiAgICB0aGlzLmZpbGUgPSBmaWxlXG4gICAgdGhpcy5zb2NrZXQuZW1pdCgnYXNrLXRva2VuJylcbiAgfVxuXG4gIHN0YXJ0VXBsb2FkKCkge1xuICAgIGlmKCF0aGlzLmZpbGUgfHwgIXRoaXMuY29ubmVjdGVkVG9QZWVyKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLnVwbG9hZGluZyA9IHRydWVcbiAgICB2YXIgZmlsZU5hbWUgPSB0aGlzLmZpbGVOYW1lLnNwbGl0KCdcXFxcJykucG9wKClcblxuICAgIHRoaXMucmVhZGVyID0gbmV3IGZpbGVyZWFkZXIodGhpcy5maWxlKVxuICAgIHRoaXMucmVhZGVyLnJlYWRGaWxlKGZ1bmN0aW9uKGRhdGEsIGNvbXBsZXRlKSB7XG4gICAgICB2YXIgcGFja2V0ID0ge1xuICAgICAgICBmaWxlTmFtZTogZmlsZU5hbWUsXG4gICAgICAgIGZpbGVTaXplOiB0aGlzLnJlYWRlci5maWxlU2l6ZSxcbiAgICAgICAgY2h1bms6IGRhdGEsXG4gICAgICAgIGNvbXBsZXRlOiBjb21wbGV0ZSxcbiAgICAgICAgZmlsZUhhc2g6IHRoaXMucmVhZGVyLmZpbGVIYXNoXG4gICAgICB9XG5cbiAgICAgIHRoaXMucDJwLmVtaXQoJ2RhdGEnLCBwYWNrZXQpXG5cbiAgICAgIGlmKGNvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMudXBsb2FkQ29tcGxldGUgPSB0cnVlXG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKVxuICB9XG5cbiAgcmVsb2FkKCkge1xuICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
