import BaseCommand from '../../base/BaseCommand'

class SetNick extends BaseCommand {
  static get name () {
    return 'setnick'
  }

  static get description () {
    return 'Changes the bot nickname'
  }

  get noPrivate () {
    return true
  }

  static get usage () {
    return [
      '```',
      ['setnick <nickname> - Changes the bot\'s nickname to the provided nick'],
      'This command cannot be run in PMs.',
      '```'
    ]
  }

  handle () {
    this.responds(/^setnick$/, () => {
      this.wrongUsage('setnick')
    })

    this.responds(/^setnick (.+)$/, matches => {
      this.server.setNickname(matches[1])
    })
  }
}

module.exports = SetNick
