System.register([], function (_export) {
  "use strict";

  var Reader;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [],
    execute: function () {
      Reader = (function () {
        function Reader(file) {
          _classCallCheck(this, Reader);

          this.file = file;
          this.chunkSize = 1048576;
          this.pos = 0;
          this.fileSize = 0;
          this.percentComplete = 0;

          this.reader = new FileReader();
          this.reader.onload = (function (e) {
            this.onChunkLoaded();
          }).bind(this);
        }

        _createClass(Reader, [{
          key: "readFile",
          value: function readFile(cb) {
            this.readCallback = cb;
            this.loadNextChunk();
          }
        }, {
          key: "onChunkLoaded",
          value: function onChunkLoaded() {
            this.fileSize = this.file.size;

            var data = this.reader.result;

            this.pos += data.byteLength;
            this.percentComplete = this.pos / this.fileSize * 100.0;
            var complete = this.pos >= this.fileSize;

            if (this.readCallback) {
              this.readCallback(data, complete);
            }

            if (!complete) {
              this.loadNextChunk();
            }
          }
        }, {
          key: "loadNextChunk",
          value: function loadNextChunk() {
            this.reader.readAsArrayBuffer(this.file.slice(this.pos, this.pos + this.chunkSize));
          }
        }]);

        return Reader;
      })();

      _export("default", Reader);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGVyZWFkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O01BQXFCLE1BQU07Ozs7Ozs7OztBQUFOLFlBQU07QUFFWixpQkFGTSxNQUFNLENBRVgsSUFBSSxFQUFFO2dDQUZELE1BQU07O0FBR3JCLGNBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLGNBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFBO0FBQ3hCLGNBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO0FBQ1osY0FBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUE7QUFDakIsY0FBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUE7O0FBRXhCLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQTtBQUM5QixjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFBLFVBQVMsQ0FBQyxFQUFFO0FBQy9CLGdCQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7V0FDckIsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUNiOztxQkFiZ0IsTUFBTTs7aUJBZWYsa0JBQUMsRUFBRSxFQUFFO0FBQ1gsZ0JBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFBO0FBQ3RCLGdCQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7V0FDckI7OztpQkFFWSx5QkFBRztBQUNkLGdCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFBOztBQUU5QixnQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUE7O0FBRTdCLGdCQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUE7QUFDM0IsZ0JBQUksQ0FBQyxlQUFlLEdBQUcsQUFBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUksS0FBSyxDQUFBO0FBQ3pELGdCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUE7O0FBRXhDLGdCQUFHLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDcEIsa0JBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFBO2FBQ2xDOztBQUVELGdCQUFHLENBQUMsUUFBUSxFQUFFO0FBQ1osa0JBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTthQUNyQjtXQUNGOzs7aUJBRVkseUJBQUc7QUFDZCxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7V0FDckY7OztlQXhDZ0IsTUFBTTs7O3lCQUFOLE1BQU0iLCJmaWxlIjoiZmlsZXJlYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlYWRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlKSB7XG4gICAgICB0aGlzLmZpbGUgPSBmaWxlXG4gICAgICB0aGlzLmNodW5rU2l6ZSA9IDEwNDg1NzZcbiAgICAgIHRoaXMucG9zID0gMFxuICAgICAgdGhpcy5maWxlU2l6ZSA9IDBcbiAgICAgIHRoaXMucGVyY2VudENvbXBsZXRlID0gMFxuXG4gICAgICB0aGlzLnJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICAgIHRoaXMucmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdGhpcy5vbkNodW5rTG9hZGVkKClcbiAgICAgIH0uYmluZCh0aGlzKVxuICAgIH1cblxuICAgIHJlYWRGaWxlKGNiKSB7XG4gICAgICB0aGlzLnJlYWRDYWxsYmFjayA9IGNiXG4gICAgICB0aGlzLmxvYWROZXh0Q2h1bmsoKVxuICAgIH1cblxuICAgIG9uQ2h1bmtMb2FkZWQoKSB7XG4gICAgICB0aGlzLmZpbGVTaXplID0gdGhpcy5maWxlLnNpemVcblxuICAgICAgdmFyIGRhdGEgPSB0aGlzLnJlYWRlci5yZXN1bHRcblxuICAgICAgdGhpcy5wb3MgKz0gZGF0YS5ieXRlTGVuZ3RoXG4gICAgICB0aGlzLnBlcmNlbnRDb21wbGV0ZSA9ICh0aGlzLnBvcyAvIHRoaXMuZmlsZVNpemUpICogMTAwLjBcbiAgICAgIHZhciBjb21wbGV0ZSA9IHRoaXMucG9zID49IHRoaXMuZmlsZVNpemVcblxuICAgICAgaWYodGhpcy5yZWFkQ2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5yZWFkQ2FsbGJhY2soZGF0YSwgY29tcGxldGUpXG4gICAgICB9XG5cbiAgICAgIGlmKCFjb21wbGV0ZSkge1xuICAgICAgICB0aGlzLmxvYWROZXh0Q2h1bmsoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGxvYWROZXh0Q2h1bmsoKSB7XG4gICAgICB0aGlzLnJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcih0aGlzLmZpbGUuc2xpY2UodGhpcy5wb3MsIHRoaXMucG9zICsgdGhpcy5jaHVua1NpemUpKTtcbiAgICB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
