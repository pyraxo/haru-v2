import path from 'path'
import _ from 'lodash'
import gm from 'gm'
import fs from 'fs'

import BaseCommand from '../../base/BaseCommand'

class Hate extends BaseCommand {
  static get name () {
    return 'hate'
  }

  static get description () {
    return 'I-I hate you!'
  }

  static get usage () {
    return [
      ['**hate** [text] - I-I hate you, <text>!']
    ]
  }

  createImage (input) {
    let text = [
      'I hate',
      'you,',
      input.match(/.{1,8}/g).join('-\n'),
      '-chan!'
    ].join('\n')

    gm(path.join(process.cwd(), 'db/images/hate.png'))
    .font(path.join(process.cwd(), 'db/fonts/animeace.ttf'), 13.5)
    .gravity('Center')
    .drawText(-67, 32, text)
    .write(path.join(process.cwd(), `db/images/${this.message.id}.png`), err => {
      if (err) {
        this.logger.error(
          `Error occurred while writing file from GM command 'hate' ` +
          `with text ${text}`, err
        )
        this.reply(
          `Error: Unable to write image with text ${text}\n${err}`
        )
        return
      }
      this.upload(
        path.join(process.cwd(), `db/images/${this.message.id}.png`), 'hate.png'
      )
      .then(() => {
        fs.unlink(path.join(process.cwd(), `db/images/${this.message.id}.png`))
      })
      .catch(err => {
        this.logger.error(
          `Error occurred while uploading file from GM command 'hate' ` +
          `with text ${text}`, err
        )
        this.reply(
          `Error: Unable to upload image with text ${text}\n${err}`
        )
        return
      })
    })
  }

  handle () {
    this.responds(/^hate$/i, () => {
      this.createImage(this.sender.name)
    })

    this.responds(/^hate (.+)$/i, matches => {
      let content = _.trim(matches[1].replace(/<@!*(\d+)>/gi, (match, p1) => {
        let user = this.client.users.get('id', p1)
        if (user) {
          return this.server.detailsOf(user).nick || user.name
        }
        return match
      }))
      this.createImage(content)
    })
  }
}

module.exports = Hate
