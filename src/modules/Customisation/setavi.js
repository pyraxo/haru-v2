import base64 from 'node-base64-image'

import BaseCommand from '../../base/BaseCommand'

class SetAvatar extends BaseCommand {
  static get name () {
    return 'setavi'
  }

  static get description () {
    return 'Changes the bot avatar'
  }

  static get usage () {
    return [
      '```',
      ['setavi <link> - Changes the bot\'s avatar to the image in the link provided'],
      '```'
    ]
  }

  get hidden () {
    return true
  }

  get adminOnly () {
    return true
  }

  handle () {
    this.responds(/^setavi (http\S+)$/, (matches) => {
      base64.base64encoder(matches[1], {
        string: true
      }, (err, image) => {
        if (err) {
          this.logger.error(
            `Avatar change called by ${this.sender.username} failed`, err
          )
          return
        }
        this.client.updateDetails({
          'avatar': new Buffer(image, 'base64')
        })
        this.logger.info(`Avatar changed by ${this.sender.username}`)
        this.send(this.channel,
          `${this.sender.mention()} changed my avatar. How do I look?`)
      })
    })
  }
}

module.exports = SetAvatar
