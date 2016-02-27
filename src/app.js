import Config from './config'

export class App {
  configureRouter(config, router) {
    config.title = 'P2PT'

    if(new Config().usePushState) {
        config.options.pushState = true
    }
    
    config.map([
      { route: ['', ':token'], name: 'index', moduleId: 'index', nav: true, title: 'P2PT' }
    ])

    this.router = router
  }
}
