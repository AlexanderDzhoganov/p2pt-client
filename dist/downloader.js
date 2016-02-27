System.register(['lodash', 'mimetype'], function (_export) {
  'use strict';

  var _, mimetype, Downloader;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_lodash) {
      _ = _lodash['default'];
    }, function (_mimetype) {
      mimetype = _mimetype['default'];
    }],
    execute: function () {
      Downloader = (function () {
        function Downloader() {
          _classCallCheck(this, Downloader);

          this.queue = [];
        }

        _createClass(Downloader, [{
          key: 'addChunk',
          value: function addChunk(fileName, fileSize, chunk, complete) {
            var download = _.find(this.queue, function (dl) {
              return dl.fileName == fileName;
            });
            if (!download) {
              this.queue.push({
                fileName: fileName,
                fileSize: fileSize,
                chunks: [chunk],
                bytesTransferred: chunk.byteLength,
                complete: complete
              });

              download = this.queue[this.queue.length - 1];
            } else {
              download.chunks.push(chunk);
              download.bytesTransferred += chunk.byteLength;
              download.fileSize = fileSize;
              download.complete = complete;
            }

            download.percentComplete = download.bytesTransferred / download.fileSize * 100.0;

            if (download.complete) {
              var blob = new Blob(download.chunks, { type: mimetype.lookup(download.fileName) });
              download.localUrl = window.URL.createObjectURL(blob);
            }
          }
        }]);

        return Downloader;
      })();

      _export('default', Downloader);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvd25sb2FkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O21CQUdxQixVQUFVOzs7Ozs7Ozs7Ozs7O0FBQVYsZ0JBQVU7QUFFaEIsaUJBRk0sVUFBVSxHQUViO2dDQUZHLFVBQVU7O0FBR3pCLGNBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFBO1NBQ2hCOztxQkFKZ0IsVUFBVTs7aUJBTW5CLGtCQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUM1QyxnQkFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQUEsRUFBRTtxQkFBSSxFQUFFLENBQUMsUUFBUSxJQUFJLFFBQVE7YUFBQSxDQUFDLENBQUE7QUFDaEUsZ0JBQUcsQ0FBQyxRQUFRLEVBQUU7QUFDWixrQkFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDZCx3QkFBUSxFQUFFLFFBQVE7QUFDbEIsd0JBQVEsRUFBRSxRQUFRO0FBQ2xCLHNCQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDZixnQ0FBZ0IsRUFBRSxLQUFLLENBQUMsVUFBVTtBQUNsQyx3QkFBUSxFQUFFLFFBQVE7ZUFDbkIsQ0FBQyxDQUFBOztBQUVGLHNCQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTthQUM3QyxNQUFNO0FBQ0wsc0JBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzNCLHNCQUFRLENBQUMsZ0JBQWdCLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQTtBQUM3QyxzQkFBUSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDNUIsc0JBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO2FBQzdCOztBQUVELG9CQUFRLENBQUMsZUFBZSxHQUFHLEFBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxRQUFRLEdBQUksS0FBSyxDQUFBOztBQUVsRixnQkFBSSxRQUFRLENBQUMsUUFBUSxFQUFFO0FBQ3JCLGtCQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUNsRixzQkFBUSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUNyRDtXQUNGOzs7ZUEvQmdCLFVBQVU7Ozt5QkFBVixVQUFVIiwiZmlsZSI6ImRvd25sb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgbWltZXR5cGUgZnJvbSAnbWltZXR5cGUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkZXIge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICB0aGlzLnF1ZXVlID0gW11cbiAgICB9XG5cbiAgICBhZGRDaHVuayhmaWxlTmFtZSwgZmlsZVNpemUsIGNodW5rLCBjb21wbGV0ZSkge1xuICAgICAgdmFyIGRvd25sb2FkID0gXy5maW5kKHRoaXMucXVldWUsIGRsID0+IGRsLmZpbGVOYW1lID09IGZpbGVOYW1lKVxuICAgICAgaWYoIWRvd25sb2FkKSB7XG4gICAgICAgIHRoaXMucXVldWUucHVzaCh7XG4gICAgICAgICAgZmlsZU5hbWU6IGZpbGVOYW1lLFxuICAgICAgICAgIGZpbGVTaXplOiBmaWxlU2l6ZSxcbiAgICAgICAgICBjaHVua3M6IFtjaHVua10sXG4gICAgICAgICAgYnl0ZXNUcmFuc2ZlcnJlZDogY2h1bmsuYnl0ZUxlbmd0aCxcbiAgICAgICAgICBjb21wbGV0ZTogY29tcGxldGVcbiAgICAgICAgfSlcblxuICAgICAgICBkb3dubG9hZCA9IHRoaXMucXVldWVbdGhpcy5xdWV1ZS5sZW5ndGggLSAxXVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG93bmxvYWQuY2h1bmtzLnB1c2goY2h1bmspXG4gICAgICAgIGRvd25sb2FkLmJ5dGVzVHJhbnNmZXJyZWQgKz0gY2h1bmsuYnl0ZUxlbmd0aFxuICAgICAgICBkb3dubG9hZC5maWxlU2l6ZSA9IGZpbGVTaXplXG4gICAgICAgIGRvd25sb2FkLmNvbXBsZXRlID0gY29tcGxldGVcbiAgICAgIH1cblxuICAgICAgZG93bmxvYWQucGVyY2VudENvbXBsZXRlID0gKGRvd25sb2FkLmJ5dGVzVHJhbnNmZXJyZWQgLyBkb3dubG9hZC5maWxlU2l6ZSkgKiAxMDAuMFxuXG4gICAgICBpZiAoZG93bmxvYWQuY29tcGxldGUpIHtcbiAgICAgICAgdmFyIGJsb2IgPSBuZXcgQmxvYihkb3dubG9hZC5jaHVua3MsIHsgdHlwZTogbWltZXR5cGUubG9va3VwKGRvd25sb2FkLmZpbGVOYW1lKSB9KVxuICAgICAgICBkb3dubG9hZC5sb2NhbFVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpXG4gICAgICB9XG4gICAgfVxuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
