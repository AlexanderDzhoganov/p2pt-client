System.register(['./config'], function (_export) {
  'use strict';

  var Config;

  _export('configure', configure);

  function configure(aurelia) {
    aurelia.use.standardConfiguration();

    if (new Config().debug) {
      aurelia.use.developmentLogging();
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }

  return {
    setters: [function (_config) {
      Config = _config['default'];
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVPLFdBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRTtBQUNqQyxXQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLENBQUE7O0FBRW5DLFFBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUU7QUFDckIsYUFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO0tBQ2pDOztBQUVELFdBQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUM7YUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFO0tBQUEsQ0FBQyxDQUFBO0dBQzlDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29uZmlnIGZyb20gJy4vY29uZmlnJ1xuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlKGF1cmVsaWEpIHtcbiAgYXVyZWxpYS51c2Uuc3RhbmRhcmRDb25maWd1cmF0aW9uKClcblxuICBpZihuZXcgQ29uZmlnKCkuZGVidWcpIHtcbiAgICBhdXJlbGlhLnVzZS5kZXZlbG9wbWVudExvZ2dpbmcoKVxuICB9XG5cbiAgYXVyZWxpYS5zdGFydCgpLnRoZW4oKCkgPT4gYXVyZWxpYS5zZXRSb290KCkpXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
