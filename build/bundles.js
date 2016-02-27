module.exports = {
  "bundles": {
    "dist/app": {
      "includes": [
        "[*.js]",
        "*.html!text",
        "*.css!text",
        "text",
        "css",
        "aurelia-framework",
        "aurelia-bootstrapper",
        "aurelia-fetch-client",
        "aurelia-router",
        "aurelia-animator-css",
        "aurelia-templating-binding",
        "aurelia-templating-resources",
        "aurelia-templating-router",
        "aurelia-loader-default",
        "aurelia-history-browser",
        "aurelia-logging-console",
        "bootstrap",
        "bootstrap/css/bootstrap.css!text",
        "dropzone",
        "dropzone/min/dropzone.min.css!text",
        "jspm/nodelibs-path",
        "lodash",
        "mimetype",
        "font-awesome/css/font-awesome.min.css!text",
        "socket.io-client",
        "socket.io-p2p"
      ],
      "options": {
        "inject": true,
        "minify": false,
        "rev": true
      }
    }
  }
};
