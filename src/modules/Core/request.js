import BaseCommand from '../../base/BaseCommand'

class RQFeature extends BaseCommand {
  static get name () {
    return 'request'
  }

  static get description () {
    return 'Requests for a new feature'
  }

  static get usage () {
    return [
      '```',
      ['request <description> - Requests for a new function'],
      '```'
    ]
  }

  handle () {
    this.responds(/^request (.+)$/i, matches => {
      this.client.admins.forEach(id => {
        let admin = this.client.users.get('id', id)
        if (admin) {
          this.send(admin, [
            '```ruby',
            '== Feature Request ==',
            `Requester: ${this.sender.name}`,
            '```',
            matches[1]
          ].join('\n'))
        }
      })
      this.reply('Thank you for your input!\n' +
      'The admins will be looking into your request shortly.')
    })
  }
}

module.exports = RQFeature
