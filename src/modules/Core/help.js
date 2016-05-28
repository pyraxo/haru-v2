import rq from 'require-all'
import path from 'path'

import BaseCommand from '../../base/BaseCommand'

class Help extends BaseCommand {
  static get name () {
    return 'help'
  }

  static get description () {
    return 'Shows the list of commands'
  }

  static get usage () {
    return [
      '```',
      [
        'help - Shows the list of commands',
        'help <command> - Displays the usage manual of the command'
      ],
      '```'
    ]
  }

  getModules () {
    let modules = rq(path.join(process.cwd(), 'lib/modules'))
    return modules
  }

  handle () {
    this.responds(/^help$/i, () => {
      let reply = []
      let modules = this.getModules()
      for (let name in modules) {
        if (modules.hasOwnProperty(name)) {
          let module = modules[name]
          if (module.length === 0) continue
          let mod = []
          mod.push(`${name}:`)
          for (let cmdName in module) {
            if (module.hasOwnProperty(cmdName)) {
              let command = module[cmdName]
              if (command.hidden === true) continue
              mod.push(`  ${this.prefix}${command.name} - ${command.description}`)
            }
          }
          if (mod.length > 1) reply.push(mod.join('\n'))
        }
      }
      this.send(this.sender, '```\n' + reply.join('\n') + '\n```')
      if (!this.isPM) {
        this.reply(':envelope_with_arrow: **Check your PMs!**')
      }
    })

    this.responds(/^help (\S+)$/i, matches => {
      let reply = [`**${matches[1]}** does not exist in the usage manual`]
      let modules = this.getModules()
      for (let name in modules) {
        if (modules.hasOwnProperty(name)) {
          let module = modules[name]
          for (let cmdName in module) {
            if (module.hasOwnProperty(cmdName)) {
              let command = module[cmdName]
              if ((command.adminOnly === true || command.hidden === true) &&
              this.isAdmin === false) continue
              if (command.name === matches[1]) {
                if (Array.isArray(command.usage) && command.usage.length > 0) {
                  reply = []
                  command.usage.forEach(elem => {
                    if (Array.isArray(elem)) {
                      elem.forEach(e => {
                        reply.push(`${this.prefix}${e}`)
                      })
                    } else {
                      reply.push(elem)
                    }
                  })
                } else if (typeof command.usage === 'string') {
                  reply = `${this.prefix}${command.usage}`
                }
              }
            }
          }
        }
      }
      this.send(this.sender, reply.join('\n'))
      if (!this.isPM) {
        this.reply(':envelope_with_arrow: **Check your PMs!**')
      }
    })
  }
}

module.exports = Help
