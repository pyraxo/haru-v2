import BaseCommand from '../../base/BaseCommand'

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

  handle () {
    this.responds(/^stats$/i, () => {
      let uptime = this.client.uptime
      let usage = process.memoryUsage()
      this.send(this.channel, [
        '```xl',
        '== Statistics ==',
        `Uptime: ${Math.round(uptime / (1000 * 60 * 60))} hours, ` +
        `${Math.round(uptime / (1000 * 60)) % 60} minutes, ` +
        `${Math.round(uptime / 1000) % 60} seconds`,
        `Cached: ${this.client.servers.length} servers, ` +
        `${this.client.channels.length} channels, ` +
        `${this.client.users.length} users.`,
        `RAM Usage: ${Math.round(usage.rss / 1000000)} MB`,
        `Heap Usage: ${Math.round(usage.heapUsed / 1000000)} MB / ` +
        `${Math.round(usage.heapTotal / 1000000)} MB`,
        '```'
      ].join('\n'))
    })
  }
}

module.exports = Statistics
