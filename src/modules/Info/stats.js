import BaseCommand from '../../base/BaseCommand'
import Database from '../../util/Database'

let Stats = new Database('stats')

class Statistics extends BaseCommand {
  static get name () {
    return 'stats'
  }

  static get description () {
    return 'Shows some statistics'
  }

  static get usage () {
    return [
      ['**stats** - Shows some statistics']
    ]
  }

  checkEntries (entry, cb) {
    Stats.has(entry, (err, res) => {
      if (err) {
        this.logger.error(
          `${this.sender.name} encountered an error querying entry`, err
        )
        this.reply(`Error querying for entries: ${err}`)
        return
      }
      return cb(res)
    })
  }

  getEntry (entry, cb) {
    Stats.get(entry, (err, tags) => {
      if (err) {
        this.logger.error(
          `${this.sender.name} encountered an error fetching entry`, err
        )
        this.reply(`Error fetching entry: ${err}`)
        return
      }
      return cb(tags)
    })
  }

  setEntry (entry, value, cb) {
    Stats.set(entry, value, err => {
      if (err) {
        this.logger.error(
          `${this.sender.name} encountered an error saving an entry`, err
        )
        this.reply(`Error saving entry: ${err}`)
        return
      }
      return cb(true)
    })
  }

  handle () {
    this.responds(/^stats$/i, () => {
      let uptime = this.client.uptime
      this.send(this.channel, [
        '```xl',
        '== Statistics ==',
        `Uptime: ${Math.round(uptime / (1000 * 60 * 60))} hours, ` +
        `${Math.round(uptime / (1000 * 60)) % 60} minutes, ` +
        `${Math.round(uptime / 1000) % 60} seconds`,
        `Cached: ${this.client.servers.length} servers, ` +
        `${this.client.channels.length} channels, ` +
        `${this.client.users.length} users.`,
        '```'
      ].join('\n'))
    })
  }
}

module.exports = Statistics
