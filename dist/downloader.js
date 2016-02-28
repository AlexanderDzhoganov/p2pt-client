System.register(['lodash', 'mimetype', 'crypto-js'], function (_export) {
  'use strict';

  var _, mimetype, CryptoJS, Downloader;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_lodash) {
      _ = _lodash['default'];
    }, function (_mimetype) {
      mimetype = _mimetype['default'];
    }, function (_cryptoJs) {
      CryptoJS = _cryptoJs['default'];
    }],
    execute: function () {
      Downloader = (function () {
        function Downloader() {
          _classCallCheck(this, Downloader);

          this.fileName = null;
          this.fileSize = 0;
          this.chunks = [];
          this.bytesTransferred = 0;
          this.complete = false;
          this.percentComplete = 0;
          this.localUrl = null;

          this.hasher = CryptoJS.algo.SHA1.create();
        }

        _createClass(Downloader, [{
          key: 'setFileInfo',
          value: function setFileInfo(fileName, fileSize) {
            this.fileName = fileName;
            this.fileSize = fileSize;
          }
        }, {
          key: 'addChunk',
          value: function addChunk(chunk) {
            this.hasher.update(CryptoJS.lib.WordArray.create(new Uint8Array(chunk)));
            this.chunks.push(chunk);
            this.bytesTransferred += chunk.byteLength;
            this.percentComplete = this.bytesTransferred / this.fileSize * 100.0;
          }
        }, {
          key: 'setComplete',
          value: function setComplete(fileHash) {
            this.complete = false;

            this.fileHash = this.hasher.finalize().toString();
            if (this.fileHash !== fileHash) {
              return false;
            }

            var blob = new Blob(this.chunks, { type: mimetype.lookup(this.fileName) });
            this.localUrl = window.URL.createObjectURL(blob);
            this.complete = true;
            return true;
          }
        }]);

        return Downloader;
      })();

      _export('default', Downloader);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvd25sb2FkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OzZCQUtxQixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7QUFBVixnQkFBVTtBQUVoQixpQkFGTSxVQUFVLEdBRWI7Z0NBRkcsVUFBVTs7QUFHekIsY0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsY0FBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUE7QUFDakIsY0FBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7QUFDaEIsY0FBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQTtBQUN6QixjQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTtBQUNyQixjQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQTtBQUN4QixjQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTs7QUFFcEIsY0FBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtTQUMxQzs7cUJBWmdCLFVBQVU7O2lCQWNoQixxQkFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQzlCLGdCQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtBQUN4QixnQkFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7V0FDekI7OztpQkFFTyxrQkFBQyxLQUFLLEVBQUU7QUFDZCxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN4RSxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDdkIsZ0JBQUksQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFBO0FBQ3pDLGdCQUFJLENBQUMsZUFBZSxHQUFHLEFBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUksS0FBSyxDQUFBO1dBQ3ZFOzs7aUJBRVUscUJBQUMsUUFBUSxFQUFFO0FBQ3BCLGdCQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTs7QUFFckIsZ0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtBQUNqRCxnQkFBRyxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtBQUM3QixxQkFBTyxLQUFLLENBQUE7YUFDYjs7QUFFRCxnQkFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDMUUsZ0JBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDaEQsZ0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLG1CQUFPLElBQUksQ0FBQTtXQUNaOzs7ZUF0Q2dCLFVBQVU7Ozt5QkFBVixVQUFVIiwiZmlsZSI6ImRvd25sb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgbWltZXR5cGUgZnJvbSAnbWltZXR5cGUnXG5cbmltcG9ydCBDcnlwdG9KUyBmcm9tICdjcnlwdG8tanMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkZXIge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICB0aGlzLmZpbGVOYW1lID0gbnVsbFxuICAgICAgdGhpcy5maWxlU2l6ZSA9IDBcbiAgICAgIHRoaXMuY2h1bmtzID0gW11cbiAgICAgIHRoaXMuYnl0ZXNUcmFuc2ZlcnJlZCA9IDBcbiAgICAgIHRoaXMuY29tcGxldGUgPSBmYWxzZVxuICAgICAgdGhpcy5wZXJjZW50Q29tcGxldGUgPSAwXG4gICAgICB0aGlzLmxvY2FsVXJsID0gbnVsbFxuXG4gICAgICB0aGlzLmhhc2hlciA9IENyeXB0b0pTLmFsZ28uU0hBMS5jcmVhdGUoKVxuICAgIH1cblxuICAgIHNldEZpbGVJbmZvKGZpbGVOYW1lLCBmaWxlU2l6ZSkge1xuICAgICAgdGhpcy5maWxlTmFtZSA9IGZpbGVOYW1lXG4gICAgICB0aGlzLmZpbGVTaXplID0gZmlsZVNpemVcbiAgICB9XG5cbiAgICBhZGRDaHVuayhjaHVuaykge1xuICAgICAgdGhpcy5oYXNoZXIudXBkYXRlKENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKG5ldyBVaW50OEFycmF5KGNodW5rKSkpXG4gICAgICB0aGlzLmNodW5rcy5wdXNoKGNodW5rKVxuICAgICAgdGhpcy5ieXRlc1RyYW5zZmVycmVkICs9IGNodW5rLmJ5dGVMZW5ndGhcbiAgICAgIHRoaXMucGVyY2VudENvbXBsZXRlID0gKHRoaXMuYnl0ZXNUcmFuc2ZlcnJlZCAvIHRoaXMuZmlsZVNpemUpICogMTAwLjBcbiAgICB9XG5cbiAgICBzZXRDb21wbGV0ZShmaWxlSGFzaCkge1xuICAgICAgdGhpcy5jb21wbGV0ZSA9IGZhbHNlXG5cbiAgICAgIHRoaXMuZmlsZUhhc2ggPSB0aGlzLmhhc2hlci5maW5hbGl6ZSgpLnRvU3RyaW5nKClcbiAgICAgIGlmKHRoaXMuZmlsZUhhc2ggIT09IGZpbGVIYXNoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKHRoaXMuY2h1bmtzLCB7IHR5cGU6IG1pbWV0eXBlLmxvb2t1cCh0aGlzLmZpbGVOYW1lKSB9KVxuICAgICAgdGhpcy5sb2NhbFVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpXG4gICAgICB0aGlzLmNvbXBsZXRlID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
