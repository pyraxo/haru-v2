import BaseCommand from '../../base/BaseCommand'

class Info extends BaseCommand {
  static get name () {
    return 'info'
  }

  static get description () {
    return 'Shows information of the bot'
  }

  static get usage () {
    return [
      ['**info** - Shows some information of the bot']
    ]
  }

  handle () {
    this.responds(/^info$/i, () => {
      this.send(this.channel, [
        `Running on **fuyu** v${process.env.npm_package_version || '1.0.0'}`,
        'I\'m designed by **pyraxo**.',
        'Find my source code at https://github.com/pyraxo/haru',
        'Invite me: https://pyraxo.moe/haru'
      ].join('\n'))
    })
  }
}

module.exports = Info
