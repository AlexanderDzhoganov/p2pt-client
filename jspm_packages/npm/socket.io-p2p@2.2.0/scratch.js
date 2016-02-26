/* */ 
var Socketiop2p = require('./index');
var io = require('socket.io-client');
var connectionUrl = '/chat';
var peerOpts = {};
var manager = io.Manager();
var socket = manager.socket(connectionUrl);
var p2psocket = new Socketiop2p(peerOpts, socket);
p2psocket.on('ready', function() {
  console.log("socketp2p ready");
  p2psocket.emit('peer-obj', 'Hello there. I am ' + p2psocket.peerId);
});
p2psocket.on('peer-msg', function(data) {
  console.log(data);
});
p2psocket.on('go-private', function() {
  p2psocket.useSockets = false;
});
