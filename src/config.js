export default class Config {
  serverUrl = 'http://localhost:9000/#'
  apiUrl = 'http://localhost:3000'
  usePushState = false
  debug = true

  p2pConfig = {
    peerOpts: {
      trickle: false,
      config: {
        "iceServers": [{
          "url": "stun:23.21.150.121",
          "urls": "stun:23.21.150.121"
        }]
      }
    }
  }
}
