import _ from 'lodash'

import BaseCommand from '../../base/BaseCommand'
import { Banker } from '../.Cache/Bank'
import { Cock, Den, Arena } from '../.Cache/Cockfight'

class Cockfight extends BaseCommand {
  static get name () {
    return 'cockfight'
  }

  static get description () {
    return 'Game of Cockfights'
  }

  listen () {
    Den.once('REQUEST_SENT:' + this.channel.id, arena => {
      let player1 = this.client.users.get('id', arena.player1)
      let player2 = this.client.users.get('id', arena.player2)
      this.send(this.channel, [
        `${player1.mention()} challenged ${player2.mention()} to a cockfight!`,
        `The other party has **60 seconds** to respond with \`${this.prefix}cockfight ready\` ` +
        'or they automatically forfeit!'
      ].join('\n'))
    })

    Den.once('REQUEST_IGNORED:' + this.channel.id, arena => {
      this.send(this.channel,
      `${this.client.users.get('id', arena.waiting).mention()} has forfeited the battle!\n` +
      'Guess they **chickened out**, huh...')
      Den.removeAllListeners('REQUEST_SENT:' + this.channel.id)
      Den.removeAllListeners('BETTING_START:' + this.channel.id)
      Den.removeAllListeners('BETTING_END:' + this.channel.id)
      Den.removeAllListeners('ARENA_START:' + this.channel.id)
      Den.removeAllListeners('ARENA_END:' + this.channel.id)
      Den.removeAllListeners('BETTING_WON:' + this.channel.id)
      Den.removeAllListeners('BETTING_LOST:' + this.channel.id)
    })

    Den.once('BETTING_START:' + this.channel.id, arena => {
      this.send(this.channel,
      'The battle will commence in 1 minute!\n' +
      `Place your bets by doing \`${this.prefix}cockfight bet <user> <amount>\`!`)
    })

    Den.once('BETTING_END:' + this.channel.id, arena => {
      this.send(this.channel, 'The betting phase is over! And so, the battle begins!')
    })

    Den.once('ARENA_START:' + this.channel.id, arena => {
      this.battle(arena)
    })

    Den.once('ARENA_END:' + this.channel.id, (arena, winner, loser) => {
      this.send(this.channel, [
        `${this.client.users.get('id', winner.id).mention()} ` +
        `wins the match with their :rooster: **${winner.name}**!`,
        'They win **1500** credits, sponsored by the loser ' +
        `${this.client.users.get('id', loser.id).mention()}!`
      ].join('\n'))
      .then(() => {
        Banker.addCredits(winner.id, 1500)
        Banker.delCredits(loser.id, 1500)
      })
    })

    Den.once('BETTING_WON', (winner, bets) => {
      bets.forEach(bet => {
        Banker.addCredits(bet.user, bet.amount)
        this.send(this.channel,
          `:moneybag:  **${this.client.users.get(bet.user)}** has won **${bet.amount}** credits!`)
      })
    })

    Den.once('BETTING_LOST', (loser, bets) => {
      bets.forEach(bet => {
        Banker.delCredits(bet.user, bet.amount)
        this.send(this.channel,
          `:money_with_wings:  **${this.client.users.get(bet.user)}** has lost **${bet.amount}** credits!`)
      })
    })
  }

  static get usage () {
    return [
      '```rb',
      '== COCKFIGHTS ==',
      '```',
      [
        'cockfight <user> - Engages in a cockfight with a user!',
        'cockfight buy - Buys a :rooster: !'
      ]
    ]
  }

  battle (arena) {
    Den.get(arena.player1).then(player1 => {
      Den.get(arena.player2).then(player2 => {
        let channel = arena.id
        player1.hp = 10
        player2.hp = 10
        let name = (player) => {
          return `[:rooster: **${player.name}**]`
        }
        const t1_hit = [
          '%player1% opens the match with a solid hit to %player2%, dealing %dmg% damage!',
          '%player1% lands the first strike on %player2%, who suffers %dmg% damage!',
          '%player2% suffers the first pounding by %player1%, who hits for %dmg% damage!',
          '%player1% secures a good first hit on %player2%, delivering %dmg% damage!',
          '%player1% administers a quick %dmg% damage on %player2% to begin the match!'
        ]
        const t1_crit = [
          '%player1% manages to land a critical strike on its first hit, dealing %dmg% damage to %player2!',
          '%player1% dispenses a critical first strike, dealing %dmg% damage to %player2%!',
          'The match begins with %player1% delivering a critical %dmg% points of damage to %player2%!'
        ]
        const t1_miss = [
          '%player1% attempts for a first hit, but misses %player2% completely!',
          'The match begins with %player1% attempting a good score on %player2% but the latter quickly dodges!',
          '%player2% dodges %player1%\'s strike, bringing the match to an intense start!'
        ]
        const hit = [
          '%player1% administers a strong hit to %player2%, dealing %dmg% damage!',
          '%player1% lands a strike on %player2%, who suffers %dmg% damage!',
          '%player2% suffers a pounding by %player1%, who hits for %dmg% damage!',
          '%player1% secures a good hit on %player2%, delivering %dmg% damage!',
          '%player1% delivers a quick %dmg% damage to %player2%!'
        ]
        const crit = [
          '%player1% delivers a swift blow to %player2% for an extra damage of %dmg%!',
          '%player1% lands a critical hit to %player2% for %dmg% damage!',
          'Ouch! %player2% suffers a heavy blow by %player1% who hits for %dmg% damage!',
          '%player1%\'s sudden strike delivers a critical hit on %player2% who suffers %dmg% damage!',
          '%player2% suffers a critical hit by %player1% of %dmg% damage!'
        ]
        const miss = [
          '%player1% delivers a quick strike towards %player2%, but alas! They miss by a small margin!',
          '%player1%\'s swift movements are no match for %player2%, who easily dodges!',
          '%player2% dodges %player1%\'s hit after hit! What a match!',
          '%player1% charges towards %player2%, who manages to dodge in the nick of time!'
        ]
        let turns = [player1, player2]
        if (Math.random() <= 0.5) {
          _.reverse(turns)
        }
        let turn = (hit, crit, miss) => {
          return new Promise((res, rej) => {
            switch (_.sample(['hit', 'hit', 'hit', 'crit', 'miss', 'miss'])) {
              case 'hit':
                this.send(channel, _.sample(hit)
                  .replace('%player1%', name(turns[0]))
                  .replace('%player2%', name(turns[1]))
                  .replace('%dmg%', `**${turns[0].dmg}**`)
                ).then(res)
                turns[1].hp -= turns[0].dmg
                break
              case 'crit':
                this.send(channel, _.sample(crit)
                  .replace('%player1%', name(turns[0]))
                  .replace('%player2%', name(turns[1]))
                  .replace('%dmg%', `**${turns[0].dmg * 2}**`)
                ).then(res)
                turns[1].hp -= turns[0].dmg * 2
                break
              case 'miss':
                this.send(channel, _.sample(miss)
                  .replace('%player1%', name(turns[0]))
                  .replace('%player2%', name(turns[1]))
                ).then(res)
                break
            }
          })
        }
        let check = () => {
          if (turns[0].hp > 0 && turns[1].hp > 0) {
            _.reverse(turns)
            setTimeout(() => {
              turn(hit, crit, miss).then(check)
            }, 2000)
          } else {
            let win = (winner, loser) => {
              winner.wins++
              winner.hp = 10
              loser.losses++
              loser.hp = 10
              Den.set(winner.id, winner)
              Den.set(loser.id, loser)
              Den.end(channel, winner, loser)
            }
            if (turns[1].hp <= 0) {
              win(turns[0], turns[1])
            } else if (turns[0].hp <= 0) {
              win(turns[1], turns[0])
            }
          }
        }
        turn(t1_hit, t1_crit, t1_miss).then(check)
      })
    })
  }

  handle () {
    this.responds(/^cockfight <@!*(\d+)>$/i, matches => {
      if (this.isPrivate) return false
      let enemID = matches[1]
      let user = this.client.users.get('id', matches[1])
      if (matches[1] === this.sender.id) {
        this.send(this.channel,
          `:information_source:  **${this.sender.name}**, you can\'t challenge yourself!!`)
      }
      if (!user) {
        this.send(this.channel, `:information_source:  **${this.sender.name}**, that user doesn\'t exist in my records!`)
        return
      } else if (user.bot === true) {
        this.send(this.channel, `:information_source:  **${this.sender.name}**, you can\'t challenge bots!`)
        return
      } else if (user.status !== 'online') {
        this.send(this.channel, `:information_source:  **${this.sender.name}**, wait until that user is online to challenge them!`)
        return
      } else if (!this.server.members.get('id', matches[1])) {
        this.send(this.channel, `:information_source:  **${this.sender.name}**, that user is not in this server.`)
        return
      } else if (Den.hasArena(this.channel.id)) {
        this.send(this.channel, `:information_source:  **${this.sender.name}**, there\'s a battle ongoing in this channel.`)
        return
      }
      Den.get(this.sender.id)
      .then(player => {
        if (!player) {
          this.send(this.channel,
            `:negative_squared_cross_mark:  **${this.sender.name}**, you don\'t own a :rooster: yet!\n` +
            `:yen:  To buy one, do \`${this.prefix}cockfight buy\`.`
          )
          return
        } else if (Den.isIngame(player.id)) {
          this.send(this.channel,
            `:negative_squared_cross_mark:  **${this.sender.name}**, you\'re in the middle of a battle!`)
          return
        }
        Den.get(enemID)
        .then(enemy => {
          if (!enemy) {
            this.send(this.channel,
              `:negative_squared_cross_mark:  **${this.sender.name}**, that user doesn\'t own a :rooster: yet!`)
            return
          } else if (Den.isIngame(enemy.id)) {
            this.send(this.channel,
              `:negative_squared_cross_mark:  **${this.sender.name}**, that player is in the middle of a battle!`)
            return
          }
          Banker.get(this.sender.id, (err, cred) => {
            if (err) {
              this.logger.error('Error reading/writing to Redis', err)
              this.reply('Error reading/writing to Redis:\n' + err)
              return
            }
            if (cred < 1500) {
              this.send(this.channel,
                `:negative_squared_cross_mark:  **${this.sender.name}**, you do not have enough credits!\n` +
                `:yen:  You need **${1500 - cred}** more credits.`)
              return
            }
            Banker.get(matches[1], (err, cred) => {
              if (err) {
                this.logger.error('Error reading/writing to Redis', err)
                this.reply('Error reading/writing to Redis:\n' + err)
                return
              }
              if (cred < 1500) {
                this.send(this.channel,
                  `:negative_squared_cross_mark:  **${this.sender.name}**, that user does not have enough credits to fight you!`)
                return
              }
            })
            this.listen()
            let arena = new Arena({
              id: this.channel.id,
              player1: player.id,
              player2: enemy.id,
              waiting: enemy.id
            })
            Den.register(this.channel.id, arena)
          })
        })
      })
    })

    this.responds(/^cockfight buy$/i, matches => {
      Den.get(this.sender.id).then(cock => {
        if (cock) {
          this.send(this.channel,
            `:information_source:  **${this.sender.name}**, you already own a :rooster: named **${cock.name}**!`)
          return
        }
        Banker.getUser(this.sender, (err, credits) => {
          if (err) {
            this.logger.error('Error reading/writing to Redis', err)
            this.reply('Error reading/writing to Redis:\n' + err)
            return
          }
          credits = parseInt(credits, 10)
          if (credits < 5000) {
            this.send(this.channel,
              `:information_source:  **${this.sender.name}**, you need **5000** credits to buy a :rooster: .\n` +
              `You only have **${credits}**.`)
            return
          }
          Banker.delCredits(this.sender, 5000)
          this.await(this.message, [
            `**${this.sender.name}** bought a new :rooster: for **5000** credits!`,
            'Time to give it a new name. What will you name it?'
          ].join('\n'), msg => {
            return /^(.+)$/.test(msg.content)
          }).then(msg => {
            this.send(this.channel, `Nice name! ${this.sender.name}'s new :rooster: is now called **${msg.content}**!`)
            let cock = new Cock({ id: this.sender.id, name: msg.content })
            Den.set(this.sender.id, cock).catch(err => {
              if (err) {
                this.logger.error('Unable to create cockfight entry', err)
                this.reply([
                  `Unable to create Cockfights entry: ${err}`,
                  'Your credits will be refunded.'
                ].join('\n'))
                Banker.addCredits(this.sender, 5000)
                return
              }
            })
          })
        })
      })
    })

    this.responds(/^cockfight ready$/i, matches => {
      if (this.isPrivate) return false
      let arena = Den.getArena(this.channel.id)
      if (!arena) {
        this.send(this.channel,
          `:information_source:  **${this.sender.name}**, no one has challenged you to a cockfight yet!\n` +
          `To challenge someone, do \`${this.prefix}cockfight fight <user>\``)
        return
      }
      if (arena.waiting !== this.sender.id) {
        this.send(this.channel,
          `:information_source:  We aren\'t waiting for your response, **${this.sender.name}**!`)
        return
      }
      Den.accepted(this.channel.id)
      this.send(this.channel, `:white_check_mark: **${this.sender.name}** has declared himself ready!`)
    })

    this.responds(/^cockfight bet <@!*(\d+)> (\d+)$/i, matches => {
      if (this.isPrivate) return false
      let amount = parseInt(matches[2], 10)
      let arena = Den.getArena(this.channel.id)
      if (this.sender.id === arena.player1 || this.sender.id === arena.player2) {
        this.send(this.channel,
          `:information_source:  **${this.sender.name}**, you\'re a participant of this battle!`)
        return
      }
      if (!arena) {
        this.send(this.channel,
          `:information_source:  **${this.sender.name}**, there\'s no battle going on in this server!`)
        return
      }
      if (arena.state !== 'betting') {
        this.send(this.channel,
          `:information_source:  **${this.sender.name}**, it isn\'t the betting phase for this battle!`)
        return
      }
      if (matches[1] !== arena.player1 && matches[1] !== arena.player2) {
        this.send(this.channel,
          `:information_source:  **${this.sender.name}**, that user isn\'t a participant of this battle!`)
        return
      }
      Banker.getUser(this.sender, (err, credits) => {
        if (err) {
          this.logger.error(`${this.sender.name} met an error fetching credits`, err)
          this.reply('Error fetching credits:\n' + err)
          return
        }
        if (amount > 5000) {
          amount = 5000
          this.send(this.channel, ':arrows_counterclockwise:  **${this.sender.name}**,  maximum bet is **5000** credits. Betting that amount.')
        }
        if (credits < amount) {
          this.send(this.channel,
            `:negative_squared_cross_mark:  **${this.sender.name}**, you do not have enough credits to bet **${amount}** credits!\n` +
            `:information_source:  You'll need **${amount - credits}** more credits.`)
          return
        }
        Den.placeBet(this.channel.id, matches[1], {
          user: this.sender.id,
          amount: amount
        })
        this.send(this.channel,
          `:information_source:  **${this.sender.name}** placed a bet of **${amount}** credits on **${this.client.users.get('id', matches[1]).name}**!`)
      })
    })
  }
}

module.exports = Cockfight
