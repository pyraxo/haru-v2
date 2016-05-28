import _ from 'lodash'
import path from 'path'

import BaseCommand from '../../base/BaseCommand'
import FDB from '../../util/FlatDatabase'

let eightball = new FDB(path.join(process.cwd(), 'db/eightball.json')).getAll()

class EightBall extends BaseCommand {
  static get name () {
    return '8ball'
  }

  static get description () {
    return 'Asks the eightball a question'
  }

  get aliases () {
    return [
      'eightball'
    ]
  }

  static get usage () {
    return [
      'The **8 Ball** attempts to solve your problems with its 20 preset answers.',
      ['**8ball <question>** will give an answer to your questions.'],
      'Aliases: `eightball`'
    ]
  }

  handle () {
    this.responds(/^(8ball|eightball)$/i, matches => {
      this.send(this.channel,
        `:8ball: | ${this.sender.name}, what is your question?`)
    })

    this.responds(/^(8ball|eightball) (.+)$/i, matches => {
      let reply = _.sample(eightball)
      this.send(this.channel,
        `:8ball: | ${this.sender.mention()}, **${reply}**`)
    })
  }
}

module.exports = EightBall
