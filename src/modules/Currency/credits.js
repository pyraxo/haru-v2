import moment from 'moment'

import BaseCommand from '../../base/BaseCommand'
import { Banker, Claims } from '../.Cache/Bank'

class Credits extends BaseCommand {
  static get name () {
    return 'credits'
  }

  static get description () {
    return 'Currency system'
  }

  static get usage () {
    return [
      '```',
      '== Credits Management System ==',
      '```',
      'Credits are a virtual currency that can be used in any server the bot is in.',
      [
        '**give** <user> <no. of credits> [message] - Sends credits to a user',
        '**peek** <user> - Takes a peek at a user\'s number of credits',
        '**lb** - Gets the rankings for credit amounts',
        '**claim** - Claims your daily credits, usable every 24 hours'
      ]
    ]
  }

  generateReceipt (amount, from, to, description) {
    let receipt = [
      '```ruby',
      '=== RECEIPT ===',
      `FROM: ${from.name}`,
      `AMOUNT: ${amount} credits`,
      `FOR: ${to.name}`
    ]
    if (description) {
      receipt.push(`DESCRIPTION:${description}`)
    }
    receipt.push('```')
    return receipt.join('\n')
  }

  genTicket (amount, by, to, description) {
    let receipt = [
      '```ruby',
      '=== NOTICE OF CREDIT ADJUSTMENT ===',
      `BY: ${by.name}`,
      `FOR: ${to.name}`,
      `AMOUNT ADJUSTED TO: ${amount} credits`
    ]
    if (description) {
      receipt.push(`DESCRIPTION:${description}`)
    }
    receipt.push('```')
    return receipt.join('\n')
  }

  genAdjustment (amount, by, to, description) {
    let receipt = [
      '```ruby',
      '=== NOTICE OF CREDIT ADJUSTMENT ===',
      `BY: ${by.name}`,
      `FOR: ${to.name}`,
      `AMOUNT ADJUSTED BY: ${amount} credits`
    ]
    if (description) {
      receipt.push(`DESCRIPTION:${description}`)
    }
    receipt.push('```')
    return receipt.join('\n')
  }

  handle () {
    this.responds(/^credits$/i, () => {
      Banker.getUser(this.sender, (err, amt) => {
        if (err) {
          this.logger.error(`${this.sender.name} met an error fetching credits`, err)
          this.reply('Error fetching credits amount:\n' + err)
          return
        }
        this.reply(`You have **${parseInt(amt, 10)}** credits.`)
      })
    })

    this.responds(/^credits (leaderboards|lb|rankings)$/i, () => {
      Banker.sortRank(10, (err, res) => {
        if (err) {
          this.logger.error(`${this.sender.name} met an error fetching credits rankings`, err)
          this.reply('Error fetching credits leaderboard:\n' + err)
          return
        }
        let ranking = ['```rb', '== DISCORD WEALTH RANKINGS (Top 10) ==']
        for (let i = 0, j = 1; i < Math.min(res.length, 20); i += 2, j++) {
          ranking.push([
            `${j}. ${this.client.users.get('id', res[i]).name} - ${res[i + 1]} credits`
          ])
        }
        ranking.push('```')
        this.send(this.channel, ranking.join('\n'))
      })
    })

    this.responds(/^credits (give|send) <@!*(\d+)> (\d+)(\s.+)*$/i, matches => {
      let amt = parseInt(matches[3], 10)
      let recipient = this.client.users.get('id', matches[2])
      if (recipient) {
        Banker.getUser(this.sender, (err, res) => {
          if (err) {
            this.logger.error(`${this.sender.name} met an error fetching credits`, err)
            this.reply('Error fetching credits amount:\n' + err)
            return
          }
          if (res) {
            if (parseInt(res, 10) < amt) {
              this.reply(`You have insufficient (**${res}**) credits.`)
              return
            } else {
              Banker.delCredits(this.sender, matches[3], (err, res) => {
                if (err) {
                  this.logger.error(`${this.sender.name} met an error removing credits`, err)
                  this.reply('Error removing credits:\n' + err)
                  return
                }
                Banker.addCredits(matches[2], matches[3], (err, res) => {
                  if (err) {
                    this.logger.error(`${this.sender.name} met an error sending credits`, err)
                    this.reply('Error sending credits:\n' + err)
                    return
                  }
                  this.send(recipient, this.generateReceipt(amt, this.sender, recipient, matches[4]))
                  this.reply(`Sent ${recipient.mention()} **${amt}** credits.`)
                })
              })
            }
          }
        })
      }
    })

    this.responds(/^credits peek <@!*(\d+)>$/i, matches => {
      let user = this.client.users.get('id', matches[1])
      if (user) {
        Banker.getUser(matches[1], (err, res) => {
          if (err) {
            this.logger.error(`${this.sender.name} met an error fetching credits`, err)
            this.reply('Error fetching credits amount:\n' + err)
            return
          }
          this.reply(`**${user.name}** has **${parseInt(res, 10)}** credits.`)
        })
      }
    })

    this.responds(/^credits claim/i, () => {
      Claims.get(this.sender.id, (err, res) => {
        if (err) {
          this.logger.error(`${this.sender.name} met an error fetching credit claims DB`, err)
          this.reply('Error fetching credit claims DB:\n' + err)
          return
        }
        let amount = Math.floor(Math.random() * 400) + 100
        if (res) {
          let diff = moment().diff(moment(res), 'hours')
          if (diff < 24) {
            this.reply(
              'You have claimed your daily credits.\n' +
              `Check back after **${24 - diff}** hours.`
            )
            return
          } else {
            Claims.set(this.sender.id, +moment(), (err, res) => {
              if (err) {
                this.logger.error(`${this.sender.name} met an error resetting claim timer`, err)
                this.reply('Error resetting claim timer:\n' + err)
                return
              }
            })
            Banker.addCredits(this.sender, amount, (err, res) => {
              if (err) {
                this.logger.error(`${this.sender.name} met an error claiming credits`, err)
                this.reply('Error claiming credits:\n' + err)
                return
              }
              this.send(this.channel,
                `**${amount}** credits added to ${this.sender.mention()}'s account.`
              )
            })
          }
        } else {
          Claims.set(this.sender.id, +moment(), (err, res) => {
            if (err) {
              this.logger.error(`${this.sender.name} met an error resetting claim timer`, err)
              this.reply('Error resetting claim timer:\n' + err)
              return
            }
          })
          Banker.setCredits(this.sender, amount + 100, (err, res) => {
            if (err) {
              this.logger.error(`${this.sender.name} met an error claiming credits`, err)
              this.reply('Error claiming credits:\n' + err)
              return
            }
            this.send(this.channel,
              `**${amount}** credits added to ${this.sender.mention()}'s account.`
            )
          })
        }
      })
    })

    this.responds(/^credits set <@!*(\d+)> (\d+)(\s.+)*$/i, matches => {
      if (!this.isAdmin) return
      let user = this.client.users.get('id', matches[1])
      if (user) {
        let amount = parseInt(matches[2], 10)
        Banker.setCredits(matches[1], amount, (err, res) => {
          if (err) {
            this.logger.error(`${this.sender.name} met an error setting credits`, err)
            this.reply('Error setting credits amount:\n' + err)
            return
          }
          this.send(user, this.genTicket(amount, this.sender, user, matches[3]))
          this.reply(`Set ${user.mention()}'s account to **${amount}** credits`)
        })
      }
    })

    this.responds(/^credits add <@!*(\d+)> (\d+)(\s.+)*$/i, matches => {
      if (!this.isAdmin) return
      let user = this.client.users.get('id', matches[1])
      if (user) {
        let amount = parseInt(matches[2], 10)
        Banker.addCredits(matches[1], amount, (err, res) => {
          if (err) {
            this.logger.error(`${this.sender.name} met an error adding credits`, err)
            this.reply('Error adding credits amount:\n' + err)
            return
          }
          this.send(user, this.genAdjustment(amount, this.sender, user, matches[3]))
          this.reply(`Added **${amount}** credits to ${user.mention()}'s account`)
        })
      }
    })

    this.responds(/^credits take <@!*(\d+)> (\d+)(\s.+)*$/i, matches => {
      if (!this.isAdmin) return
      let user = this.client.users.get('id', matches[1])
      if (user) {
        let amount = parseInt(matches[2], 10)
        Banker.delCredits(matches[1], amount, (err, res) => {
          if (err) {
            this.logger.error(`${this.sender.name} met an error removing credits`, err)
            this.reply('Error removing credits amount:\n' + err)
            return
          }
          this.send(user, this.genAdjustment(-amount, this.sender, user, matches[3]))
          this.reply(`Removed **${amount}** credits from ${user.mention()}'s account`)
        })
      }
    })
  }
}

module.exports = Credits
