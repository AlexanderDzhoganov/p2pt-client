import Config from './config'

export class App {
  configureRouter(config, router) {
    config.title = 'Bitf.ly - secure file transfer over WebRTC'

    if(new Config().usePushState) {
        config.options.pushState = true
    }
    
    config.map([
      { route: ['', ':token'], name: 'index', moduleId: 'index', nav: true }
    ])

    this.router = router
  }
}
