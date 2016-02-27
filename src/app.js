export class App {
  configureRouter(config, router) {
    config.title = 'P2PT';
    config.map([
      { route: ['', ':token'], name: 'index', moduleId: 'index', nav: true, title: 'P2PT' }
    ]);

    this.router = router;
  }
}
