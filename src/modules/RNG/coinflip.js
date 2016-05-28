import _ from 'lodash'

import BaseCommand from '../../base/BaseCommand'

class Coinflip extends BaseCommand {
  static get name () {
    return 'coinflip'
  }

  static get description () {
    return 'Flips coins'
  }

  static get usage () {
    return [
      'The **coinflip** command tosses coins and gives you the results.',
      ['**this.prefix coinflip [number of coins]**' +
      ' where the no. of coins flipped defaults to 1'],
      'e.g. `coinflip 20`'
    ]
  }

  static get aliases () {
    return [
      'cointoss',
      'coins'
    ]
  }

  get result () {
    let res = ['HEADS', 'TAILS']
    return _.sample(res)
  }

  handle () {
    this.responds(/^(coinflip|cointoss|coins)$/i, () => {
      this.send(this.channel, `${this.sender.name} got **${this.result}**!`)
    })

    this.responds(/^(coinflip|cointoss|coins) (\d+)$/i, matches => {
      let replies = []
      for (let i = 0; i < parseInt(matches[2], 10); i++) {
        replies.push(this.result)
      }
      this.send(
        this.channel,
        [
          '```xl',
          replies.join(' '),
          '```',
          `${this.sender.name} got **${_.countBy(replies)['HEADS']}** ` +
          `heads and **${_.countBy(replies)['TAILS']}** tails!`
        ].join('\n')
      )
    })
  }
}

module.exports = Coinflip
