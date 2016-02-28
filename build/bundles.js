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
        "aurelia-templating-binding",
        "aurelia-templating-resources",
        "aurelia-templating-router",
        "aurelia-loader-default",
        "aurelia-history-browser",
        "aurelia-logging-console",
        "dropzone",
        "dropzone/min/dropzone.min.css!text",
        "bulma/css/bulma.min.css!text",
        "jspm/nodelibs-path",
        "jquery",
        "lodash",
        "mimetype",
        "crypto-js",
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
