import _ from 'lodash'

import BaseCommand from '../../base/BaseCommand'

class Choose extends BaseCommand {
  static get name () {
    return 'choose'
  }

  static get description () {
    return 'Makes me choose between 2 or more options'
  }

  get aliases () {
    return [
      'pick'
    ]
  }

  static get usage () {
    return [
      'The **choose** command will allow the bot to choose among your given options',
      ['**choose** <choice 1>, <choice 2>[, choices...]'],
      'e.g. `choose black and blue, white and gold, neither`',
      'Reply: _I pick **white and gold**!_',
      'Aliases: `pick`'
    ]
  }

  handle () {
    this.responds(/^(choose|pick) (.+)/i, matches => {
      let result = matches[2].split(', ')
      this.reply(`I pick **${_.sample(result)}**!`)
    })
  }
}

module.exports = Choose
