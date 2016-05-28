import moment from 'moment'
import _ from 'lodash'
import prettyjson from 'prettyjson'

const MESSAGE_CHAR_LIMIT = 2000
const MESSAGE_RATE_LIMIT = 10

class BaseCommand {
  constructor (message, client, container) {
    if (this.constructor === BaseCommand) {
      throw new Error('Can\'t instantiate abstract command!')
    }
    this.message = message
    this.client = client
    this.container = container
    this.logger = container.get('logger')
    this.init()
  }

  init () {}

  static get name () {
    throw new Error('Commands must have names')
  }

  static get description () {
    throw new Error('Commands must have descriptions')
  }

  get aliases () {
    return []
  }

  static get usage () {
    return 'This command does not have a usage manual'
  }

  get hidden () {
    return false
  }

  get adminOnly () {
    return false
  }

  get noPrivate () {
    return false
  }

  get server () {
    return this.message.channel.server
  }

  get channel () {
    return this.message.channel
  }

  get time () {
    return moment(this.message.timestamp).format('HH:mm:ss')
  }

  get sender () {
    return this.message.sender
  }

  get isBotMentioned () {
    return this.rawContent.indexOf(this.prefix) === 0 ||
      this.message.isMentioned(this.client.user) || this.isPM
  }

  get isEveryoneMentioned () {
    return this.message.everyoneMentioned
  }

  get rawContent () {
    return this.message.content
  }

  get content () {
    let content = this.rawContent
    content = _.trim(content.replace(
      new RegExp(`^(${this.client.user.mention()})|(\\${this.prefix})`), ''
    ))
    return content
  }

  get isPM () {
    return this.message.channel.isPrivate
  }

  get prefix () {
    return this.container.getParam('prefix')
  }

  get mentions () {
    let users = []
    for (let idx in this.message.mentions) {
      if (this.message.mentions.hasOwnProperty(idx)) {
        let user = this.message.mentions[idx]
        if (typeof user.id !== 'undefined' &&
        typeof user.username !== 'undefined') {
          users.push({
            id: user.id,
            name: user.username,
            mention: user.mention
          })
        }
      }
    }

    return users
  }

  get isAdmin () {
    return this.client.admins.indexOf(this.sender.id) > -1
  }

  get user () {
    return this.client.user
  }

  wrongUsage (name) {
    this.reply(
      `Please run \`${this.prefix}help ${name}\` to use this command properly`
    )
  }

  reply (content, options) {
    if (!this.isPM) {
      content = `${this.sender.mention()}, ${content}`
    }
    return this.send(this.message, content, options)
  }

  send (dest, content, options = {delay: 0, deleteDelay: 0}) {
    //  Not sure if destructuring works
    let {delay, deleteDelay} = options
    if (content.length > MESSAGE_RATE_LIMIT * MESSAGE_CHAR_LIMIT) {
      return this.logger.error(
        'Error sending a message larger than the character and rate limit\n' +
        content
      )
    }

    if (delay) {
      return setTimeout(() => {
        this.send(dest, content, {delay: 0, deleteDelay})
      }, delay)
    }

    let msgRem = ''
    if (content.length > 2000) {
      content = content.match(/.{1,20000}/g)
      msgRem = content.shift()
      content = content.join('')
    }

    return new Promise((res, rej) => {
      this.client.sendMessage(dest, content, (err, msg) => {
        if (err) return rej(err)

        if (deleteDelay) {
          this.client.deleteMessage(msg, {wait: deleteDelay}, err => {
            if (err) return rej(err)
            if (!msgRem) res(msg)
          })

          if (!msgRem) return
        }

        if (msgRem) {
          return this.send(dest, msgRem, options)
            .then(msg => {
              return res(Array.isArray(msg) ? msg.concat(msg) : [msg])
            })
            .catch(rej)
        }

        res(msg)
      })
    })
  }

  upload (attachment, name, channel) {
    channel = channel || this.channel
    return new Promise((res, rej) => {
      this.client.sendFile(channel, attachment, name)
      .then(msg => res(msg))
      .catch(err => rej(err))
    })
  }

  handle () {
    throw new Error('Commands must override message handler')
  }

  checkPrivateAndAdminOnly () {
    if (this.noPrivate && this.isPM) {
      this.reply('This command cannot be run via PMs.')
      return false
    }
    if (this.adminOnly === true && !this.isAdmin) {
      return false
    }

    return true
  }

  prettyPrint (regex, matches) {
    let commandInfo = prettyjson.render({
      Command: {
        time: this.time,
        sender: this.sender.username,
        server: typeof this.server === 'undefined'
          ? undefined : this.server.name,
        channel: typeof this.channel === 'undefined'
          ? undefined : this.channel.name,
        content: this.content,
        botMention: this.isBotMentioned,
        pm: this.isPM,
        regex: regex ? regex.toString() : '',
        matches: matches,
        mentions: this.mentions
      }
    })
    return commandInfo
  }

  getMatches (content, regex, cb, noPrint) {
    let matches = regex.exec(content)

    if (matches === null || !this.checkPrivateAndAdminOnly()) {
      return false
    }

    let result = cb(matches)

    if (!noPrint && result !== false) {
      this.logger.debug(`\n${this.prettyPrint(regex, matches)}`)
    }
  }

  hears (regex, callback) {
    let noPrint = !this.container.get('debug')
    return this.getMatches(this.rawContent, regex, callback, noPrint)
  }

  responds (regex, callback) {
    if (!this.isBotMentioned) {
      return
    }
    let noPrint = !this.container.get('debug')
    return this.getMatches(this.content, regex, callback, noPrint)
  }

}

module.exports = BaseCommand
