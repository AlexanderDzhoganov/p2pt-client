import Config from './config'

import 'aurelia-templating-binding'

export function configure(aurelia) {
  aurelia.use.defaultBindingLanguage().defaultResources()

  if(new Config().debug) {
    aurelia.use.developmentLogging()
  }

  aurelia.start().then(() => aurelia.setRoot())
}
