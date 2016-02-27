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
          this.chunkSize = 542288;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGVyZWFkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O01BQXFCLE1BQU07Ozs7Ozs7OztBQUFOLFlBQU07QUFFWixpQkFGTSxNQUFNLENBRVgsSUFBSSxFQUFFO2dDQUZELE1BQU07O0FBR3JCLGNBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLGNBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFBO0FBQ3ZCLGNBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO0FBQ1osY0FBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUE7QUFDakIsY0FBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUE7O0FBRXhCLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQTtBQUM5QixjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFBLFVBQVMsQ0FBQyxFQUFFO0FBQy9CLGdCQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7V0FDckIsQ0FBQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUNiOztxQkFiZ0IsTUFBTTs7aUJBZWYsa0JBQUMsRUFBRSxFQUFFO0FBQ1gsZ0JBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFBO0FBQ3RCLGdCQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7V0FDckI7OztpQkFFWSx5QkFBRztBQUNkLGdCQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFBOztBQUU5QixnQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUE7O0FBRTdCLGdCQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUE7QUFDM0IsZ0JBQUksQ0FBQyxlQUFlLEdBQUcsQUFBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUksS0FBSyxDQUFBO0FBQ3pELGdCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUE7O0FBRXhDLGdCQUFHLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDcEIsa0JBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFBO2FBQ2xDOztBQUVELGdCQUFHLENBQUMsUUFBUSxFQUFFO0FBQ1osa0JBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTthQUNyQjtXQUNGOzs7aUJBRVkseUJBQUc7QUFDZCxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7V0FDckY7OztlQXhDZ0IsTUFBTTs7O3lCQUFOLE1BQU0iLCJmaWxlIjoiZmlsZXJlYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlYWRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihmaWxlKSB7XG4gICAgICB0aGlzLmZpbGUgPSBmaWxlXG4gICAgICB0aGlzLmNodW5rU2l6ZSA9IDU0MjI4OFxuICAgICAgdGhpcy5wb3MgPSAwXG4gICAgICB0aGlzLmZpbGVTaXplID0gMFxuICAgICAgdGhpcy5wZXJjZW50Q29tcGxldGUgPSAwXG5cbiAgICAgIHRoaXMucmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgICAgdGhpcy5yZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLm9uQ2h1bmtMb2FkZWQoKVxuICAgICAgfS5iaW5kKHRoaXMpXG4gICAgfVxuXG4gICAgcmVhZEZpbGUoY2IpIHtcbiAgICAgIHRoaXMucmVhZENhbGxiYWNrID0gY2JcbiAgICAgIHRoaXMubG9hZE5leHRDaHVuaygpXG4gICAgfVxuXG4gICAgb25DaHVua0xvYWRlZCgpIHtcbiAgICAgIHRoaXMuZmlsZVNpemUgPSB0aGlzLmZpbGUuc2l6ZVxuXG4gICAgICB2YXIgZGF0YSA9IHRoaXMucmVhZGVyLnJlc3VsdFxuXG4gICAgICB0aGlzLnBvcyArPSBkYXRhLmJ5dGVMZW5ndGhcbiAgICAgIHRoaXMucGVyY2VudENvbXBsZXRlID0gKHRoaXMucG9zIC8gdGhpcy5maWxlU2l6ZSkgKiAxMDAuMFxuICAgICAgdmFyIGNvbXBsZXRlID0gdGhpcy5wb3MgPj0gdGhpcy5maWxlU2l6ZVxuXG4gICAgICBpZih0aGlzLnJlYWRDYWxsYmFjaykge1xuICAgICAgICB0aGlzLnJlYWRDYWxsYmFjayhkYXRhLCBjb21wbGV0ZSlcbiAgICAgIH1cblxuICAgICAgaWYoIWNvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMubG9hZE5leHRDaHVuaygpXG4gICAgICB9XG4gICAgfVxuXG4gICAgbG9hZE5leHRDaHVuaygpIHtcbiAgICAgIHRoaXMucmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKHRoaXMuZmlsZS5zbGljZSh0aGlzLnBvcywgdGhpcy5wb3MgKyB0aGlzLmNodW5rU2l6ZSkpO1xuICAgIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
