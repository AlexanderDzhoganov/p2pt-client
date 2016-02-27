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
          this.previewImage = null;
          this.uploading = false;
          this.uploadComplete = false;
          this.downloader = null;
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
                _this.downloader.addChunk(packet.fileName, packet.fileSize, packet.data, packet.complete);
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
                url: "/file/post",
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
              this.p2p.emit('data', {
                fileName: fileName,
                fileSize: this.reader.fileSize,
                data: data,
                complete: complete
              });

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
//# sourceMappingURL=data:application/json;base64,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Ozs7aUJBRVUsdUJBQUc7QUFDWixnQkFBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3RDLHFCQUFNO2FBQ1A7O0FBRUQsZ0JBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO0FBQ3JCLGdCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTs7QUFFOUMsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3ZDLGdCQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBLFVBQVMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUM1QyxrQkFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3BCLHdCQUFRLEVBQUUsUUFBUTtBQUNsQix3QkFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUTtBQUM5QixvQkFBSSxFQUFFLElBQUk7QUFDVix3QkFBUSxFQUFFLFFBQVE7ZUFDbkIsQ0FBQyxDQUFBOztBQUVGLGtCQUFHLFFBQVEsRUFBRTtBQUNYLG9CQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQTtlQUMzQjthQUNGLENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtXQUNkOzs7aUJBRUssa0JBQUc7QUFDUCxvQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFBO1dBQ2xCOzs7cUJBekpVLEtBQUs7QUFBTCxhQUFLLEdBRGpCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FDRixLQUFLLEtBQUwsS0FBSztlQUFMLEtBQUsiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2luamVjdH0gZnJvbSAnYXVyZWxpYS1mcmFtZXdvcmsnXG5pbXBvcnQge1JvdXRlcn0gZnJvbSAnYXVyZWxpYS1yb3V0ZXInXG5cbmltcG9ydCBwMnAgZnJvbSAnc29ja2V0LmlvLXAycCdcbmltcG9ydCBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50J1xuXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSdcbmltcG9ydCBEcm9wem9uZSBmcm9tICdkcm9wem9uZSdcblxuaW1wb3J0IGZpbGVyZWFkZXIgZnJvbSAnLi9maWxlcmVhZGVyJ1xuaW1wb3J0IGRvd25sb2FkZXIgZnJvbSAnLi9kb3dubG9hZGVyJ1xuXG5pbXBvcnQgQ29uZmlnIGZyb20gJy4vY29uZmlnJ1xuXG5AaW5qZWN0KFJvdXRlcilcbmV4cG9ydCBjbGFzcyBJbmRleCB7XG5cbiAgaXNVcGxvYWRlciA9IHRydWVcbiAgY29ubmVjdGVkVG9QZWVyID0gZmFsc2VcblxuICB0b2tlbiA9IG51bGxcblxuICBmaWxlID0gbnVsbFxuICBwcmV2aWV3SW1hZ2UgPSBudWxsXG4gIHVwbG9hZGluZyA9IGZhbHNlXG4gIHVwbG9hZENvbXBsZXRlID0gZmFsc2VcblxuICBkb3dubG9hZGVyID0gbnVsbFxuXG4gIHRvdGFsVHJhbnNmZXJzID0gMFxuXG4gIGNvbnN0cnVjdG9yKHJvdXRlcikge1xuICAgIHRoaXMucm91dGVyID0gcm91dGVyXG4gICAgRHJvcHpvbmUuYXV0b0Rpc2NvdmVyID0gZmFsc2VcbiAgICBEcm9wem9uZS5hdXRvUHJvY2Vzc1F1ZXVlID0gZmFsc2VcbiAgICB0aGlzLmRvd25sb2FkZXIgPSBuZXcgZG93bmxvYWRlcigpXG4gICAgdGhpcy5jb25maWcgPSBuZXcgQ29uZmlnKClcbiAgICB0aGlzLnNlcnZlclVybCA9IHRoaXMuY29uZmlnLnNlcnZlclVybFxuICB9XG5cbiAgYWN0aXZhdGUocGFyYW1zKSB7XG4gICAgaWYocGFyYW1zLnRva2VuKSB7XG4gICAgICB0aGlzLmlzVXBsb2FkZXIgPSBmYWxzZVxuICAgICAgdGhpcy50b2tlbiA9IHBhcmFtcy50b2tlblxuICAgIH1cbiAgfVxuXG4gIGJpbmQoKSB7XG4gICAgaWYodGhpcy5pc1VwbG9hZGVyKSB7XG4gICAgICB0aGlzLmluaXREcm9wem9uZSgpXG4gICAgfVxuXG4gICAgdGhpcy5zb2NrZXQgPSBpbyh0aGlzLmNvbmZpZy5hcGlVcmwpXG4gIFxuICAgIHRoaXMuc29ja2V0Lm9uKCdjb25uZWN0JywgKCkgPT4ge1xuICAgICAgaWYodGhpcy50b2tlbikge1xuICAgICAgICB0aGlzLnNvY2tldC5lbWl0KCdzZXQtdG9rZW4nLCB0aGlzLnRva2VuKVxuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSlcblxuICAgIHRoaXMuc29ja2V0Lm9uKCdlcnJvcicsIGVyciA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICB9LmJpbmQodGhpcykpXG5cbiAgICB0aGlzLnNvY2tldC5vbignc2V0LXRva2VuLWludmFsaWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZSgnLycpXG4gICAgICBsb2NhdGlvbi5yZWxvYWQoKVxuICAgIH0uYmluZCh0aGlzKSlcblxuICAgIHRoaXMuc29ja2V0Lm9uKCd0b3RhbC10cmFuc2ZlcnMnLCB2YWwgPT4ge1xuICAgICAgdGhpcy50b3RhbFRyYW5zZmVycyA9IHZhbFxuICAgIH0uYmluZCh0aGlzKSlcblxuICAgIHRoaXMuc29ja2V0Lm9uKCdzZXQtdG9rZW4tb2snLCB0b2tlbiA9PiB7XG4gICAgICB0aGlzLnRva2VuID0gdG9rZW5cblxuICAgICAgdGhpcy5wMnAgPSBuZXcgcDJwKHRoaXMuc29ja2V0LCB7XG4gICAgICAgIHBlZXJPcHRzOiB7XG4gICAgICAgICAgdHJpY2tsZTogZmFsc2UsXG4gICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICBcImljZVNlcnZlcnNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogXCJzdHVuOjIzLjIxLjE1MC4xMjFcIixcbiAgICAgICAgICAgICAgICBcInVybHNcIjogXCJzdHVuOjIzLjIxLjE1MC4xMjFcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB0aGlzLnAycC5vbigncmVhZHknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wMnAudXNlUGVlckNvbm5lY3Rpb24gPSB0cnVlXG4gICAgICB9LmJpbmQodGhpcykpXG5cbiAgICAgIHRoaXMucDJwLm9uKCd1cGdyYWRlJywgZGF0YSA9PiB7XG4gICAgICAgIHRoaXMuY29ubmVjdGVkVG9QZWVyID0gdHJ1ZVxuXG4gICAgICAgIGlmICh0aGlzLmZpbGUpIHtcbiAgICAgICAgICB0aGlzLnN0YXJ0VXBsb2FkKClcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICB0aGlzLnAycC5vbigncGVlci1lcnJvcicsIGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgICB0aGlzLmNvbm5lY3RlZFRvUGVlciA9IGZhbHNlXG4gICAgICB9LmJpbmQodGhpcykpXG5cbiAgICAgIHRoaXMucDJwLm9uKCdlcnJvcicsIGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgICB0aGlzLmNvbm5lY3RlZFRvUGVlciA9IGZhbHNlXG4gICAgICB9LmJpbmQodGhpcykpXG5cbiAgICAgIHRoaXMucDJwLm9uKCdkYXRhJywgcGFja2V0ID0+IHtcbiAgICAgICAgdGhpcy5kb3dubG9hZGVyLmFkZENodW5rKHBhY2tldC5maWxlTmFtZSwgcGFja2V0LmZpbGVTaXplLCBwYWNrZXQuZGF0YSwgcGFja2V0LmNvbXBsZXRlKVxuICAgICAgfS5iaW5kKHRoaXMpKVxuICAgIH0uYmluZCh0aGlzKSlcbiAgfVxuXG4gIGluaXREcm9wem9uZSgpIHtcbiAgICB2YXIgdmlldyA9IHRoaXNcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5kcm9wem9uZSA9IG5ldyBEcm9wem9uZShcImRpdiNkcm9wem9uZVwiLCB7XG4gICAgICAgIHVybDogXCIvZmlsZS9wb3N0XCIsXG4gICAgICAgIGFkZGVkZmlsZTogZmlsZSA9PiB7XG4gICAgICAgICAgdmlldy5maWxlQWRkZWQoZmlsZSlcbiAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICB0aHVtYm5haWw6IChmaWxlLCBkYXRhVXJsKSA9PiB7XG4gICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgdXBsb2FkcHJvZ3Jlc3M6ICgpID0+IHt9LFxuICAgICAgICBhdXRvUHJvY2Vzc1F1ZXVlOiBmYWxzZVxuICAgICAgfSlcbiAgICB9LmJpbmQodGhpcyksIDApXG4gIH1cblxuICBmaWxlQWRkZWQoZmlsZSkge1xuICAgICQoJyNkcm9wem9uZS10ZXh0JykuaHRtbChmaWxlLm5hbWUpXG4gICAgdGhpcy5maWxlTmFtZSA9IGZpbGUubmFtZVxuICAgIHRoaXMuY29udGVudFR5cGUgPSBmaWxlLnR5cGVcbiAgICB0aGlzLmZpbGUgPSBmaWxlXG4gICAgdGhpcy5zb2NrZXQuZW1pdCgnYXNrLXRva2VuJylcbiAgfVxuXG4gIHN0YXJ0VXBsb2FkKCkge1xuICAgIGlmKCF0aGlzLmZpbGUgfHwgIXRoaXMuY29ubmVjdGVkVG9QZWVyKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLnVwbG9hZGluZyA9IHRydWVcbiAgICB2YXIgZmlsZU5hbWUgPSB0aGlzLmZpbGVOYW1lLnNwbGl0KCdcXFxcJykucG9wKClcblxuICAgIHRoaXMucmVhZGVyID0gbmV3IGZpbGVyZWFkZXIodGhpcy5maWxlKVxuICAgIHRoaXMucmVhZGVyLnJlYWRGaWxlKGZ1bmN0aW9uKGRhdGEsIGNvbXBsZXRlKSB7XG4gICAgICB0aGlzLnAycC5lbWl0KCdkYXRhJywge1xuICAgICAgICBmaWxlTmFtZTogZmlsZU5hbWUsXG4gICAgICAgIGZpbGVTaXplOiB0aGlzLnJlYWRlci5maWxlU2l6ZSxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgY29tcGxldGU6IGNvbXBsZXRlXG4gICAgICB9KVxuXG4gICAgICBpZihjb21wbGV0ZSkge1xuICAgICAgICB0aGlzLnVwbG9hZENvbXBsZXRlID0gdHJ1ZVxuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSlcbiAgfVxuXG4gIHJlbG9hZCgpIHtcbiAgICBsb2NhdGlvbi5yZWxvYWQoKVxuICB9XG5cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
