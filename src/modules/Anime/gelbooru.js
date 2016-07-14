import BaseCommand from '../../base/BaseCommand'
import img from '../.Cache/ImageFetcher'

class Gelbooru extends BaseCommand {
  static get name () {
    return 'gelbooru'
  }

  static get description () {
    return 'Searches the Gelbooru image board'
  }

  static get usage () {
    return [
      ['**gelbooru** [tags...] - Searches danbooru']
    ]
  }

  noPictures (query) {
    this.send(this.channel,
      `**Error**: Query "${query.split('+').join(', ')}"` +
      ` returned no pictures.`
    )
  }

  reducePage (query) {
    // Temporary workaround for tags with far less than 10000 images
    img('gelbooru', query, this, `limit=100`)
    .then(res => {
      this.fetchResults(res, query)
    })
  }

  fetchResults (res, query) {
    let r = res[~~(Math.random() * res.length)]
    if (r && r.file_url) {
      this.send(this.channel, [
        `**Score**: ${r.score}`,
        r.file_url
      ].join('\n'))
      return
    }
    this.reducePage(query)
  }

  getImage (query, pass) {
    if (pass === true) {
      img('gelbooru', query, this, `pid=${Math.floor(Math.random() * 500)}`)
      .then(res => {
        try {
          res = JSON.parse(res.text)
        } catch (err) {
          this.noPictures(query)
          return
        }
        if (res.length === 0) {
          this.getImage(query, false)
        } else {
          this.fetchResults(res, query)
        }
      })
    } else {
      img('gelbooru', query, this)
      .then(res => {
        try {
          res = JSON.parse(res.text)
        } catch (err) {
          this.noPictures(query)
          return
        }
        if (res.length < 100) {
          this.fetchResults(res, query)
        } else {
          this.getImage(query, true)
        }
      })
    }
  }

  handle () {
    this.responds(/^gelbooru$/i, () => {
      this.getImage()
    })

    this.responds(/^gelbooru (.+)$/i, matches => {
      let query = matches[1].split(' ').join('+')
      this.getImage(query)
    })
  }
}

module.exports = Gelbooru
