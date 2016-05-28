import rq from 'require-all'
import path from 'path'

import BaseCommand from '../../base/BaseCommand'

class Reload extends BaseCommand {
  static get name () {
    return 'reload'
  }

  static get description () {
    return 'Reloads all modules'
  }

  static get usage () {
    return [
      '```',
      ['reload - Reloads all modules'],
      '```'
    ]
  }

  get adminOnly () {
    return true
  }

  get hidden () {
    return true
  }

  getModules () {
    let modules = rq(path.join(process.cwd(), 'lib/modules'))
    return modules
  }

  handle () {
    this.responds(/^reload$/i, () => {
      let moduleNum = Object.keys(this.getModules()).length
      this.container.get('handler').reloadModules()
      this.logger.info(`${this.sender.name} has reloaded all modules.`)
      this.send(this.channel, `Reloaded all **${moduleNum}** modules.`)
    })
  }
}

module.exports = Reload
