import path from 'path'
import request from 'superagent'
import xml2jsParser from 'superagent-xml2jsparser'
import he from 'he'

import BaseCommand from '../../base/BaseCommand'
import FDB from '../../util/FlatDatabase'

let config = new FDB(path.join(process.cwd(), 'config/mal.json')).getAll()

class Anime extends BaseCommand {
  static get name () {
    return 'anime'
  }

  static get description () {
    return 'The command for weebs'
  }

  static get usage () {
    return [
      ['**anime** <anime title> - Searches for an anime']
    ]
  }

  genEntry (entry) {
    this.send(this.channel, [
      `\n:mag_right:  **${entry.title}**`,
      entry.english ? `\n**English Title**: ${entry.english}` : '\n',
      `**Score**: ${entry.score}`,
      `**Episodes**: ${entry.episodes}`,
      `**Status**: ${entry.status}`,
      `**Type**: ${entry.type || 'None'}`,
      `**Start Date**: ${entry.start_date}`,
      `**End Date**: ${entry.end_date}`,
      `**Synopsis**: ${
        entry.synopsis[0]
        ? he.decode(entry.synopsis[0])
        .replace(/<br\s*[\/]?>/gi, '')
        .replace(/\[\/*i\]\s*/gi, '*')
        .replace(/\[\/*b\]\s*/gi, '**')
        : 'none'
      }`,
      `http://myanimelist.net/anime/${entry.id}`
    ].join('\n'))
  }

  handle () {
    this.responds(/^anime (.+)$/i, matches => {
      let query = matches[1].split(' ').join('+')
      request
      .get(`http://myanimelist.net/api/anime/search.xml?q=${query}`)
      .auth(config.user, config.pass)
      .accept('xml')
      .buffer(true)
      .parse(xml2jsParser)
      .end((err, res) => {
        if (err) {
          this.logger.error(`Error fetching MAL DB:\n`, err)
          this.reply(`**Error** querying MAL DB: ${err}`)
          return
        }
        if (res.body === null) {
          this.reply(`No anime by the name **${matches[1]}** could be found.`)
          return
        }
        let entries = res.body.anime.entry
        if (entries.length === 1) {
          this.genEntry(entries[0])
          return
        }
        if (entries.length > 10) entries.length = 10
        let reply = ['**Please choose your desired show by entering its number:**']
        entries.forEach((elem, idx) => {
          reply.push(`${idx + 1}. ${elem.title}`)
        })
        this.client.awaitResponse(this.message, reply.join('\n'))
        .then(msg => {
          if (!/^\d+$/.test('10')) {
            this.reply('That is an invalid response.')
            return
          }
          let num = parseInt(msg.content, 10)
          if (num > 10) {
            this.reply('There\'s no anime entry with that index!')
          }
          this.genEntry(entries[num - 1])
        })
      })
    })
  }
}

module.exports = Anime
