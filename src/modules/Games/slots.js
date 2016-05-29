import _ from 'lodash'

import BaseCommand from '../../base/BaseCommand'
import { Banker, Claims } from '../.Cache/Bank'
import RL from '../.Cache/RateLimiter'

class Slots extends BaseCommand {
  static get name () {
    return 'slots'
  }

  static get description () {
    return 'Slot machine game'
  }

  static get usage () {
    return [
      '```rb',
      '== SLOTS ==',
      '```',
      ['slots [amount] - Spins with the amount of wager, min 1 max 100']
    ]
  }

  get symbols () {
    return [
      '🍒', '🍒', '🍒',
      '7⃣',
      '🍐', '🍐', '🍐', '🍐',
      '🇱🇻', '🇱🇻',
      '🍈', '🍈', '🍈', '🍈',
      '🍇', '🍇', '🍇', '🍇',
      '🍊', '🍊', '🍊', '🍊',
      '💎',
      '🍉', '🍉', '🍉', '🍉',
      '🔔'
    ]
  }

  get wins () {
    return {
      '🍒1': 2,
      '🍒2': 5,
      '🍒3': 10,
      '7⃣2': 50,
      '7⃣3': 150,
      '🍐3': 20,
      '🍈3': 20,
      '🍇3': 20,
      '🍊3': 20,
      '💎2': 25,
      '💎3': 200,
      '🔔3': 50,
      '🍉3': 20,
      '🇱🇻2': 40,
      '🇱🇻3': 100
    }
  }

  spin (bet) {
    let symbols = this.symbols
    if (RL.isLimited(this.sender)) {
      this.client.deleteMessage(this.message)
      return this.reply(
        `Calm down, you\'re spamming \`${this.prefix}slots\` too quickly!`, {
          deleteDelay: 3000
        })
    }
    RL.inc(this.sender)
    if (bet <= 0) bet = 1
    if (bet > 100) bet = 100
    Banker.getUser(this.sender, (err, credits) => {
      if (err) {
        this.logger.error(`${this.sender.name} met an error fetching credits`, err)
        this.reply('Error fetching credits amount:\n' + err)
        return
      }
      credits = parseInt(credits, 10)
      if (credits === 0) {
        this.reply(
          `You have no remaining funds.`)
        return
      } else if (credits < bet) {
        this.reply(
          `You have insufficient funds of only **${credits}** credit(s).\n` +
          `Out of credits? You can use \`${this.prefix}credits claim\` to ` +
          'get credits every 24 hours'
        )
        return
      }
      Banker.delCredits(this.sender, bet, (err, res) => {
        if (err) {
          this.logger.error(`${this.sender.name} met an error removing credits`, err)
          this.reply('Error removing credits amount:\n' + err)
          return
        }
        let machine = []
        for (let i = 0; i < 3; i++) {
          let sample = []
          while (sample.length < 3) {
            sample = _.uniq(_.sampleSize(symbols, 3))
          }
          machine.push(sample)
        }
        let payline = [machine[0][1], machine[1][1], machine[2][1]]
        this.send(this.channel, [
          '**__   S   L   O   T   S   __**',
          `|| ${machine[0][0]} ${machine[1][0]} ${machine[2][0]} ||`,
          `> ${payline.join(' ')} <`,
          `|| ${machine[0][2]} ${machine[1][2]} ${machine[2][2]} ||`,
          `\n**${this.sender.name}** used **${bet}** credit(s) and...`
        ].join('\n'))
        .then(msg => {
          this.checkWins(payline, bet)
          .then(amount => {
            let message = ` won **${amount}** credits! Congratulations!`
            this.client.updateMessage(msg, msg.content.substring(0, msg.content.length - 3) + message)
            Banker.addCredits(this.sender, amount, (err, res) => {
              if (err) {
                this.logger.error(`${this.sender.name} met an error adding credits`, err)
                this.reply('Error adding credits amount:\n' + err)
                return
              }
            })
          })
          .catch(() => {
            this.client.updateMessage(msg, msg.content.substring(0, msg.content.length - 3) +
            ' didn\'t win anything. Better luck next time!')
          })
        })
      })
    })
  }

  checkWins (payline, bet) {
    let payout = this.wins
    return new Promise(function (res, rej) {
      let report = _.countBy(payline)
      let reward = 0
      Object.keys(report).forEach((elem, idx) => {
        let win = payout[`${elem}${report[elem]}`]
        reward += win ? win * bet : 0
      })
      if (reward > 0) return res(reward)
      return rej()
    })
  }

  handle () {
    this.responds(/^slots$/i, () => {
      this.spin(1)
    })

    this.responds(/^slots (\d+)$/i, matches => {
      let bet = matches[1]
      this.spin(bet)
    })
  }
}

module.exports = Slots
