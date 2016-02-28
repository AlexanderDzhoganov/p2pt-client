System.register(['crypto-js'], function (_export) {
  'use strict';

  var CryptoJS, Reader;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_cryptoJs) {
      CryptoJS = _cryptoJs['default'];
    }],
    execute: function () {
      Reader = (function () {
        function Reader(file) {
          _classCallCheck(this, Reader);

          this.file = file;
          this.chunkSize = 542288;
          this.pos = 0;
          this.fileSize = 0;
          this.percentComplete = 0;

          this.fileHasher = CryptoJS.algo.SHA1.create();
          this.fileHash = null;

          this.reader = new FileReader();
          this.reader.onload = (function (e) {
            this.onChunkLoaded();
          }).bind(this);
        }

        _createClass(Reader, [{
          key: 'readFile',
          value: function readFile(cb) {
            this.readCallback = cb;
            this.loadNextChunk();
          }
        }, {
          key: 'onChunkLoaded',
          value: function onChunkLoaded() {
            this.fileSize = this.file.size;

            var data = this.reader.result;

            this.pos += data.byteLength;
            this.percentComplete = this.pos / this.fileSize * 100.0;
            var complete = this.pos >= this.fileSize;

            this.fileHasher.update(CryptoJS.lib.WordArray.create(new Uint8Array(data)));

            if (!complete) {
              this.loadNextChunk();
            } else {
              this.fileHash = this.fileHasher.finalize().toString();
            }

            if (this.readCallback) {
              this.readCallback(data, complete);
            }
          }
        }, {
          key: 'loadNextChunk',
          value: function loadNextChunk() {
            this.reader.readAsArrayBuffer(this.file.slice(this.pos, this.pos + this.chunkSize));
          }
        }]);

        return Reader;
      })();

      _export('default', Reader);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGVyZWFkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O2dCQUVxQixNQUFNOzs7Ozs7Ozs7OztBQUFOLFlBQU07QUFFWixpQkFGTSxNQUFNLENBRVgsSUFBSSxFQUFFO2dDQUZELE1BQU07O0FBR3JCLGNBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLGNBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFBO0FBQ3ZCLGNBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO0FBQ1osY0FBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUE7QUFDakIsY0FBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUE7O0FBRXhCLGNBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDN0MsY0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7O0FBRXBCLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQTtBQUM5QixjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFBLFVBQVMsQ0FBQyxFQUFFO0FBQy9CLGdCQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7V0FDckIsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUNiOztxQkFoQmdCLE1BQU07O2lCQWtCZixrQkFBQyxFQUFFLEVBQUU7QUFDWCxnQkFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUE7QUFDdEIsZ0JBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtXQUNyQjs7O2lCQUVZLHlCQUFHO0FBQ2QsZ0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUE7O0FBRTlCLGdCQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQTs7QUFFN0IsZ0JBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQTtBQUMzQixnQkFBSSxDQUFDLGVBQWUsR0FBRyxBQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBSSxLQUFLLENBQUE7QUFDekQsZ0JBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQTs7QUFFeEMsZ0JBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRTNFLGdCQUFHLENBQUMsUUFBUSxFQUFFO0FBQ1osa0JBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTthQUNyQixNQUFNO0FBQ0wsa0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTthQUN0RDs7QUFFRCxnQkFBRyxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3BCLGtCQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTthQUNsQztXQUNGOzs7aUJBRVkseUJBQUc7QUFDZCxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7V0FDckY7OztlQS9DZ0IsTUFBTTs7O3lCQUFOLE1BQU0iLCJmaWxlIjoiZmlsZXJlYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDcnlwdG9KUyBmcm9tICdjcnlwdG8tanMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlYWRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlKSB7XG4gICAgICB0aGlzLmZpbGUgPSBmaWxlXG4gICAgICB0aGlzLmNodW5rU2l6ZSA9IDU0MjI4OFxuICAgICAgdGhpcy5wb3MgPSAwXG4gICAgICB0aGlzLmZpbGVTaXplID0gMFxuICAgICAgdGhpcy5wZXJjZW50Q29tcGxldGUgPSAwXG5cbiAgICAgIHRoaXMuZmlsZUhhc2hlciA9IENyeXB0b0pTLmFsZ28uU0hBMS5jcmVhdGUoKVxuICAgICAgdGhpcy5maWxlSGFzaCA9IG51bGxcblxuICAgICAgdGhpcy5yZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgICB0aGlzLnJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMub25DaHVua0xvYWRlZCgpXG4gICAgICB9LmJpbmQodGhpcylcbiAgICB9XG5cbiAgICByZWFkRmlsZShjYikge1xuICAgICAgdGhpcy5yZWFkQ2FsbGJhY2sgPSBjYlxuICAgICAgdGhpcy5sb2FkTmV4dENodW5rKClcbiAgICB9XG5cbiAgICBvbkNodW5rTG9hZGVkKCkge1xuICAgICAgdGhpcy5maWxlU2l6ZSA9IHRoaXMuZmlsZS5zaXplXG5cbiAgICAgIHZhciBkYXRhID0gdGhpcy5yZWFkZXIucmVzdWx0XG5cbiAgICAgIHRoaXMucG9zICs9IGRhdGEuYnl0ZUxlbmd0aFxuICAgICAgdGhpcy5wZXJjZW50Q29tcGxldGUgPSAodGhpcy5wb3MgLyB0aGlzLmZpbGVTaXplKSAqIDEwMC4wXG4gICAgICB2YXIgY29tcGxldGUgPSB0aGlzLnBvcyA+PSB0aGlzLmZpbGVTaXplXG5cbiAgICAgIHRoaXMuZmlsZUhhc2hlci51cGRhdGUoQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUobmV3IFVpbnQ4QXJyYXkoZGF0YSkpKVxuXG4gICAgICBpZighY29tcGxldGUpIHtcbiAgICAgICAgdGhpcy5sb2FkTmV4dENodW5rKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZmlsZUhhc2ggPSB0aGlzLmZpbGVIYXNoZXIuZmluYWxpemUoKS50b1N0cmluZygpXG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMucmVhZENhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMucmVhZENhbGxiYWNrKGRhdGEsIGNvbXBsZXRlKVxuICAgICAgfVxuICAgIH1cblxuICAgIGxvYWROZXh0Q2h1bmsoKSB7XG4gICAgICB0aGlzLnJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcih0aGlzLmZpbGUuc2xpY2UodGhpcy5wb3MsIHRoaXMucG9zICsgdGhpcy5jaHVua1NpemUpKTtcbiAgICB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
