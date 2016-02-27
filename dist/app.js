System.register(['./config'], function (_export) {
  'use strict';

  var Config, App;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_config) {
      Config = _config['default'];
    }],
    execute: function () {
      App = (function () {
        function App() {
          _classCallCheck(this, App);
        }

        _createClass(App, [{
          key: 'configureRouter',
          value: function configureRouter(config, router) {
            config.title = 'Bitf.ly';

            if (new Config().usePushState) {
              config.options.pushState = true;
            }

            config.map([{ route: ['', ':token'], name: 'index', moduleId: 'index', nav: true }]);

            this.router = router;
          }
        }]);

        return App;
      })();

      _export('App', App);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Y0FFYSxHQUFHOzs7Ozs7Ozs7OztBQUFILFNBQUc7aUJBQUgsR0FBRztnQ0FBSCxHQUFHOzs7cUJBQUgsR0FBRzs7aUJBQ0MseUJBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUM5QixrQkFBTSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUE7O0FBRXhCLGdCQUFHLElBQUksTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFFO0FBQzFCLG9CQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7YUFDbEM7O0FBRUQsa0JBQU0sQ0FBQyxHQUFHLENBQUMsQ0FDVCxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUN2RSxDQUFDLENBQUE7O0FBRUYsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO1dBQ3JCOzs7ZUFiVSxHQUFHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb25maWcgZnJvbSAnLi9jb25maWcnXG5cbmV4cG9ydCBjbGFzcyBBcHAge1xuICBjb25maWd1cmVSb3V0ZXIoY29uZmlnLCByb3V0ZXIpIHtcbiAgICBjb25maWcudGl0bGUgPSAnQml0Zi5seSdcblxuICAgIGlmKG5ldyBDb25maWcoKS51c2VQdXNoU3RhdGUpIHtcbiAgICAgICAgY29uZmlnLm9wdGlvbnMucHVzaFN0YXRlID0gdHJ1ZVxuICAgIH1cbiAgICBcbiAgICBjb25maWcubWFwKFtcbiAgICAgIHsgcm91dGU6IFsnJywgJzp0b2tlbiddLCBuYW1lOiAnaW5kZXgnLCBtb2R1bGVJZDogJ2luZGV4JywgbmF2OiB0cnVlIH1cbiAgICBdKVxuXG4gICAgdGhpcy5yb3V0ZXIgPSByb3V0ZXJcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
