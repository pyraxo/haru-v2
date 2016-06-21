import BaseCommand from '../../base/BaseCommand'

class Echo extends BaseCommand {
  static get name () {
    return 'echo'
  }

  static get description () {
    return 'Echoes any given input'
  }

  static get usage () {
    return [
      '```',
      ['echo <text> - Echoes the text'],
      '```'
    ]
  }

  get adminOnly () {
    return true
  }

  handle () {
    this.responds(/^echo$/i, matches => {
      this.reply('No given input to echo!')
    })

    this.responds(/^echo (.+)$/i, matches => {
      this.send(this.channel, matches[1])
    })
  }
}

module.exports = Echo
