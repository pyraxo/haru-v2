import escape from 'escape-string-regexp'
import path from 'path'
import _ from 'lodash'

import BaseCommand from '../../base/BaseCommand'
import FDB from '../../util/FlatDatabase'
import DL from '../../util/Datalist'

let replies = new FDB(path.join(process.cwd(), 'db/replies/replies.json')).getAll()
let rc = new DL(path.join(process.cwd(), 'db/replies/reply_channels.json'))

class Replies extends BaseCommand {
  static get name () {
    return 'replies'
  }

  static get description () {
    return 'Replies to certain keywords'
  }

  static get usage () {
    return [
      [
        '**replies** - Toggles replies',
        '**replies list** - Lists replies'
      ]
    ]
  }

  init () {
    Object.keys(replies).forEach(elem => {
      this.hearExpression(elem)
    })
  }

  replaceString (string) {
    let replacements = {
      '%sender%': this.sender.username,
      '%server%': this.server.name,
      '%channel%': this.channel.name
    }
    for (let str in replacements) {
      if (replacements.hasOwnProperty(str)) {
        string = string.replace(str, replacements[str])
      }
    }
    return string
  }

  hearExpression (exp) {
    if (rc.has(this.channel.id)) {
      this.hears(new RegExp(`\^${escape(exp)}\$`, 'i'), () => {
        let reply = ''
        let r = replies[exp]
        if (Array.isArray(replies[exp])) {
          reply = r[Math.floor(Math.random() * r.length)]
        } else {
          reply = r
        }
        this.send(this.channel, this.replaceString(reply))
      })
    }
  }

  handle () {
    this.responds(/^replies list$/i, () => {
      let reply = []
      for (let exp in replies) {
        reply.push(exp)
      }
      this.reply([
        'List of expressions that will trigger a reply:',
        `\`ayy, wew, ${reply.join(', ')}\``
      ].join('\n'))
    })

    this.responds(/^replies$/i, () => {
      if (rc.has(this.channel.id)) {
        rc.del(this.channel.id)
        this.reply('Banned replies on this channel.')
      } else {
        rc.push(this.channel.id)
        this.reply('Allowed replies on this channel.')
      }
    })

    if (rc.has(this.channel.id)) {
      this.hears(/^ay(y+)$/i, matches => {
        this.send(this.channel, `lma${Array(matches[1].length + 1).join('o')}`)
      })

      this.hears(/^we(w+)$/i, matches => {
        this.send(this.channel, `la${Array(matches[1].length).join('d')}`)
      })
    }
  }
}

module.exports = Replies
