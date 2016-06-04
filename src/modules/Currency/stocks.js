import BaseCommand from '../../base/BaseCommand'
import request from 'superagent'

class Stocks extends BaseCommand {
  static get name () {
    return 'stocks'
  }

  static get description () {
    return 'Fetches certain stock from ticker symbols'
  }

  static get usage () {
    return [
      ['**stocks** <symbol> - Fetches the specific stock']
    ]
  }

  handle () {
    this.responds(/^stocks (.+)$/i, matches => {
      let symbol = matches[1]
      request
      .get(`http://www.google.com/finance/info?q=${symbol}`)
      .end((err, res) => {
        if (res.statusCode === 400) {
          this.send(this.channel,
            `:negative_squared_cross_mark:  Stock **$${symbol.toUpperCase()}** does not exist, **${this.sender.name}**!`
          )
          return
        } else if (err) {
          this.reply(`**Error**: Fetching ${symbol.toUpperCase()} met with ${err}`)
          return
        }
        res = JSON.parse(res.text.replace('//', ''))[0]
        this.send(this.channel, [
          '```xl',
          `${res.e}:${res.t}`,
          '```',
          `**Current price**: ${res.l}`,
          `**Change**: ${res.c} (${res.cp}%)`,
          `**Last update**: ${res.ltt}`
        ].join('\n'))
      })
    })
  }
}

module.exports = Stocks
