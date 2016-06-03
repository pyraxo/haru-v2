import BaseCommand from '../../base/BaseCommand'

class Info extends BaseCommand {
  static get name () {
    return 'invite'
  }

  static get description () {
    return 'Gets the invite link of the bot'
  }

  static get usage () {
    return [
      ['**invite** - <https://pyraxo.moe/haru>']
    ]
  }

  handle () {
    this.responds(/^invite$/i, () => {
      this.send(this.channel,
        `:information_source:  **${this.sender.name}**, to invite me to your server, visit <https://pyraxo.moe/haru>!`)
    })
  }
}

module.exports = Info
