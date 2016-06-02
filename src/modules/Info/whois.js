import moment from 'moment'
import _ from 'lodash'

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
    let count = 0
    this.client.servers.map(server => { if (server.members.get('id', user.id)) count++ })
    return [
      '```rb',
      `   User: ${user.username}#${user.discriminator}`,
      `     ID: ${user.id}`,
      `   Nick: ${this.server.detailsOf(user).nick || 'none'}`,
      ` Status: ${user.status}`,
      `Playing: ${user.game ? user.game.name : 'none'}`,
      user.bot ? `    Bot: ${user.bot}\`\`\`` : '```',
      `\`Shared servers\`: ${count}`,
      `\`Created at: ${moment((user.id / 4194304) + 1420070400000).format('ddd, Do MMMM YYYY, h:mm:ss a [GMT]Z')}\``,
      `\`Joined at: ${moment(this.server.detailsOf(user).joinedAt).format('ddd, Do MMMM YYYY, h:mm:ss a [GMT]Z')}\``,
      `\`Roles\`: ${roles.length > 0 ? roles.join(', ') : 'none'}`
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
