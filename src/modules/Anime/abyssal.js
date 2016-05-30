import BaseCommand from '../../base/BaseCommand'
import img from '../.Cache/ImageFetcher'
import DB from '../.Cache/WaifuDB'

class Abyssal extends BaseCommand {
  static get name () {
    return 'abyssal'
  }

  static get description () {
    return 'Finds you an abyssal'
  }

  static get usage () {
    return [
      ['**abyssal** - Finds you an abyssal']
    ]
  }

  abyssalGet (name, url) {
    this.send(this.channel, `Your abyssal is **${name}**\n${url}`)
  }

  noPictures (query) {
    this.logger.error(
      `**Error**: Query "${query.split('+').join(', ')}"` +
      ` returned no pictures.`
    )
    this.getWaifu()
  }

  fetchGB (res, query, name) {
    let r = []
    try {
      r = JSON.parse(res.text)[0]
    } catch (err) {
      this.logger.error(`Error fetching '${query}'`, err)
      this.reply(`Error fetching '${query}' - ${err}`)
      return
    }
    if (r && r.file_url) {
      if (r.rating === 's') {
        this.shipgirlGet(name, r.file_url)
      } else {
        this.fetchGB(res, query, name)
      }
      return
    }
    this.reducePage(query, name)
    return
  }

  reducePage (query, name) {
    // Temporary workaround for tags with less than 10000 images
    img('gelbooru', query, this, `limit=100`)
    .then(res => {
      this.fetchGB(res, query, name)
    })
  }

  gelbooru (name, query) {
    query = query.split(' ').join('_')
    img('gelbooru', query, this, `pid=${Math.floor(Math.random() * 10000)}`)
    .then(res => {
      this.fetchGB(res, query, name)
    })
  }

  yandere (name, query) {
    query = query.split(' ').join('_')
    img('yandere', query, this)
    .then((res) => {
      let r = res.body[0]
      if (typeof r !== 'undefined') {
        this.abyssalGet(name, r.file_url)
      } else {
        this.gelbooru(name, query)
      }
    })
  }

  handle () {
    this.responds(/^abyssal$/i, () => {
      let data = DB.Abyssals
      let char = data[Math.floor(Math.random() * data.length)].split(' || ')
      this.yandere(char[0], char[1])
    })
  }
}

module.exports = Abyssal
