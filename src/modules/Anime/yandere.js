import BaseCommand from '../../base/BaseCommand'
import img from '../.Cache/ImageFetcher'

class Yandere extends BaseCommand {
  static get name () {
    return 'yandere'
  }

  static get description () {
    return 'Searches the Yande.re image board'
  }

  static get usage () {
    return [
      ['**yandere** [tags...] - Searches yande.re']
    ]
  }

  noPictures (query) {
    this.send(this.channel,
      `**Error**: Query "${query.split('+').join(', ')}"` +
      ` returned no pictures.`
    )
  }

  getImage (query) {
    img('yandere', query)
    .then((res) => {
      let r = res.body[0]
      if (typeof r !== 'undefined') {
        this.send(
          this.channel,
          `**Score**: ${r.score}\n${r.file_url}`
        )
      } else {
        this.noPictures(query)
      }
    })
  }

  handle () {
    this.responds(/^yandere$/i, () => {
      this.getImage()
    })

    this.responds(/^yandere (.+)$/i, matches => {
      let query = matches[1].split(' ').join('+')
      this.getImage(query)
    })
  }
}

module.exports = Yandere
