import escape from 'escape-string-regexp'
import BaseCommand from '../../base/BaseCommand'

class LMGTFY extends BaseCommand {
  static get name () {
    return 'lmgtfy'
  }

  static get description () {
    return 'Let me Google that for you!'
  }

  get aliases () {
    return [
      'google'
    ]
  }

  static get usage () {
    return [
      ['**lmgtfy <text>**'],
      'Too lazy to Google? Let this bot help Google that for you!',
      'Aliases: `google`'
    ]
  }

  handle () {
    this.responds(/^lmgtfy$/i, () => {
      this.reply('http://lmgtfy.com/?q=how+to+use+lmgtfy')
    })

    this.responds(/^lmgtfy (.+)$/i, matches => {
      this.reply(`http://lmgtfy.com/?q=${
        escape(matches[1].split(' ').join('+'))
      }`)
    })
  }
}

module.exports = LMGTFY
