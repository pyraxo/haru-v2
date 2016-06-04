import path from 'path'
import _ from 'lodash'
import gm from 'gm'
import fs from 'fs'

import BaseCommand from '../../base/BaseCommand'

class Love extends BaseCommand {
  static get name () {
    return 'love'
  }

  static get description () {
    return 'I\'all always love you!'
  }

  static get usage () {
    return [
      ['**love** [text] - I\'ll always love you, <text>!']
    ]
  }

  createImage (input) {
    let text = [
      'I\'ll always',
      'love you,',
      input.match(/.{1,10}/g).join('-\n')
    ].join('\n')

    gm(path.join(process.cwd(), 'db/images/love.png'))
    .font(path.join(process.cwd(), 'db/fonts/animeace.ttf'), 13.5)
    .gravity('Center')
    .drawText(-188, -20, text)
    .write(path.join(process.cwd(), `db/images/${this.message.id}.png`), err => {
      if (err) {
        this.logger.error(
          `Error occurred while writing file from GM command 'love' ` +
          `with text ${text}`, err
        )
        this.reply(
          `Error: Unable to write image with text ${text}\n${err}`
        )
        return
      }
      this.upload(
        path.join(process.cwd(), `db/images/${this.message.id}.png`), 'love.png'
      )
      .then(() => {
        fs.unlink(path.join(process.cwd(), `db/images/${this.message.id}.png`))
      })
      .catch(err => {
        this.logger.error(
          `Error occurred while uploading file from GM command 'love' ` +
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
    this.responds(/^love$/i, () => {
      this.createImage(this.sender.name)
    })

    this.responds(/^love (.+)$/i, matches => {
      let content = _.trim(matches[1].replace(/<@!*(\d+)>/gi, (match, p1) => {
        let user = this.client.users.get('id', p1)
        if (user) {
          return user.name
        }
        return match
      }))
      this.createImage(content)
    })
  }
}

module.exports = Love
