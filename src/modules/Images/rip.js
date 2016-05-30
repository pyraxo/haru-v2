import path from 'path'
import gm from 'gm'
import fs from 'fs'
import Canvas, {Image as Image} from 'canvas'
import base64 from 'node-base64-image'

import BaseCommand from '../../base/BaseCommand'
import ImageCacher from '../.Cache/ImageCacher'

class RIP extends BaseCommand {
  static get name () {
    return 'rip'
  }

  static get description () {
    return 'Rest in peace'
  }

  static get usage () {
    return [
      ['**rip** [text | user] - Here lies a dead soul']
    ]
  }

  createImage (input) {
    input = input.match(/.+/g).join('-\n')
    gm(path.join(process.cwd(), 'db/images/rip.png'))
    .font(path.join(process.cwd(), 'db/fonts/comicsans.ttf'), 21.5)
    .gravity('Center')
    .drawText(-10, 70, input)
    .fontSize(11)
    .drawText(-7, 94, Math.floor(Math.random() * (2016 - 1900) + 1) + ' - 2016')
    .write(path.join(process.cwd(), `db/images/${this.message.id}.png`), err => {
      if (err) {
        this.logger.error(
          `Error occurred while writing file from GM command 'rip'`, err
        )
        this.reply(`Error: Unable to write image\n${err}`)
        return
      }
      this.upload(
        path.join(process.cwd(), `db/images/${this.message.id}.png`), 'rip.png'
      )
      .then(() => {
        fs.unlink(path.join(process.cwd(), `db/images/${this.message.id}.png`))
      })
      .catch(err => {
        this.logger.error(
          `Error occurred while uploading file from GM command 'rip'`, err
        )
        this.reply(`Error: Unable to upload image\n${err}`)
        return
      })
    })
  }

  genImage (image) {
    let canvas = new Canvas(1920, 2160)
    let ctx = canvas.getContext('2d')
    let base = new Image()
    base.src = new Buffer(image, 'base64')
    ctx.drawImage(base, 440, 0, 1000, 1000)
    fs.readFile(path.join(process.cwd(), 'db/images/rip2.png'), (err, src) => {
      if (err) {
        this.logger.error('Error reading alt rip base image', err)
        return
      }
      let c = new Image()
      c.src = src
      ctx.drawImage(c, 0, 0, 1920, 2160)
      let out = fs.createWriteStream(
        path.join(process.cwd(), `db/images/${this.message.id}.png`)
      )
      let stream = canvas.pngStream()

      stream.on('data', chunk => {
        out.write(chunk)
      })

      stream.on('end', () => {
        setTimeout(() => {
          this.upload(
            path.join(process.cwd(), `db/images/${this.message.id}.png`), 'dead.png'
          ).then(() => {
            fs.unlink(path.join(process.cwd(), `db/images/${this.message.id}.png`))
          })
        }, 500)
      })
    })
  }

  altImage (user) {
    if (ImageCacher.has(user.id)) {
      this.genImage(ImageCacher.get(user.id))
    } else {
      base64.base64encoder(user.avatarURL, { string: true }, (err, image) => {
        if (err) {
          this.logger.error(
            `Image fetch from ${user.avatarURL} failed`, err
          )
          return
        }
        ImageCacher.add(user.id, image)
        this.genImage(image)
      })
    }
  }

  handle () {
    this.responds(/^rip$/i, () => {
      if (Math.random() < 0.5) {
        this.createImage(this.sender.name)
      } else {
        this.altImage(this.sender)
      }
    })

    this.responds(/^rip <@!*(\d+)>$/i, matches => {
      let user = this.client.users.get('id', matches[1])
      if (Math.random() < 0.5) {
        let name = user ? user.name : `<@${matches[1]}>`
        this.createImage(name)
      } else {
        if (user) {
          this.altImage(this.sender)
        }
      }
    })

    this.responds(/^rip ("|')(.+)\1$/i, matches => {
      this.createImage(matches[2])
    })
  }
}

module.exports = RIP
