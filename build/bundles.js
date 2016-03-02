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
        "aurelia-pal",
        "aurelia-pal-browser",
        "aurelia-event-aggregator",
        "aurelia-polyfills",
        "aurelia-templating-binding",
        "aurelia-templating-resources",
        "aurelia-loader-default",
        "aurelia-logging-console",
        "dropzone",
        "jspm/nodelibs-path",
        "mimetype",
        "crypto-js",
        "socket.io-client",
        "socket.io-p2p"
      ],
      "options": {
        "inject": true,
        "minify": true,
        "rev": true
      }
    }
  }
};
