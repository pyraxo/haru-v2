import BaseCommand from '../../base/BaseCommand'

class ServerInfo extends BaseCommand {
  static get name () {
    return 'server'
  }

  static get description () {
    return 'Shows information of the server'
  }

  get noPrivate () {
    return true
  }

  static get usage () {
    return [
      '```',
      ['server - Shows some info on the server'],
      'This command cannot be run in PMs.',
      '```'
    ]
  }

  handle () {
    this.responds(/^server$/i, () => {
      let rolesList = []
      for (let role of this.server.roles) {
        if (role.name === '@everyone') continue
        rolesList.push(role.name)
      }
      this.send(this.channel, [
        '```xl',
        `${this.server.name}`,
        `ID: ${this.server.id}`,
        `Region: ${this.server.region}`,
        `Members: ${this.server.members.length} (${
          this.server.members.reduce((count, member) => {
            count += member.status === 'online' ? 1 : 0
            return count
          }, 0)
        } online)`,
        `Owner: ${this.server.owner.name} <${this.server.owner.id}>`,
        `Roles: ${rolesList.join(', ')}`,
        '```'
      ].join('\n'))
    })
  }
}

module.exports = ServerInfo
