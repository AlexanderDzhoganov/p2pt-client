import Config from './config'

export function configure(aurelia) {
  aurelia.use.standardConfiguration()

  if(new Config().debug) {
    aurelia.use.developmentLogging()
  }

  aurelia.start().then(() => aurelia.setRoot())
}
