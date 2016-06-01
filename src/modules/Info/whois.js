import _ from 'lodash'
import moment from 'moment'

import BaseCommand from '../../base/BaseCommand'

class Whois extends BaseCommand {
  static get name () {
    return 'whois'
  }

  static get description () {
    return 'Shows information of any user'
  }

  static get aliases () {
    return [
      'whoami'
    ]
  }

  static get usage () {
    return [
      ['**whois** - Shows some info on users'],
      'In PMs, use `whoami`'
    ]
  }

  fetchUser (user) {
    if (!user) {
      return 'I don\'t know that user.'
    }
    let roles = []
    _.remove(this.server.rolesOf(user), r => {
      return r.name !== '@everyone'
    }).forEach(elem => {
      roles.push(elem.name)
    })
    return [
      '```rb',
      `  User: ${user.username}#${user.discriminator}`,
      `    ID: ${user.id}`,
      `Status: ${user.status}`,
      `  Game: ${user.game ? user.game.name : 'none'}`,
      `   Bot: ${user.bot}`,
      ` Roles: ${roles.length > 0 ? roles.join('\n\t\t') : 'none'}`,
      '```'
    ].join('\n')
  }

  handle () {
    this.responds(/^(whois|whoami)$/i, () => {
      this.send(this.channel, this.fetchUser(this.sender))
      this.upload(this.sender.avatarURL)
    })

    this.responds(/^whois <@!*(\d+)>$/i, matches => {
      let user = this.client.users.get('id', matches[1])
      this.send(this.channel, this.fetchUser(user))
      this.upload(user.avatarURL)
    })
  }
}

module.exports = Whois
