import BaseCommand from '../../base/BaseCommand'
import img from '../.Cache/ImageFetcher'
import DB from '../.Cache/WaifuDB'

class Waifu extends BaseCommand {
  static get name () {
    return 'waifu'
  }

  static get description () {
    return 'Finds you a waifu'
  }

  waifuGet (name, show, url) {
    this.send(this.channel, `Your waifu is ${name} (${show})\n${url}`)
  }

  noPictures (query) {
    this.logger.error(
      `**Error**: Query "${query.split('+').join(', ')}"` +
      ` returned no pictures.`
    )
    this.getWaifu()
  }

  fetchGB (res, query, name, show) {
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
        this.waifuGet(name, show, r.file_url)
      } else {
        this.fetchGB(res, query, name, show)
      }
      return
    }
    return this.reducePage(query, name, show)
  }

  reducePage (query, name, show) {
    // Temporary workaround for tags with less than 10000 images
    img('gelbooru', query, this, `limit=100`)
    .then(res => {
      this.fetchGB(res, query, name, show)
    })
  }

  gelbooru (name, show) {
    let query = name.split(' ').join('_')
    img('gelbooru', query, this, `pid=${Math.floor(Math.random() * 10000)}`)
    .then(res => {
      name = name.substring(name.length - 1) === ')'
      ? name.substring(name.indexOf('('))
      : name
      this.fetchGB(res, query, name, show)
    })
  }

  yandere (name, show) {
    let query = name.split(' ').join('_')
    img('yandere', query, this)
    .then((res) => {
      let r = res.body[0]
      if (typeof r !== 'undefined') {
        this.waifuGet(name, show, r.file_url)
      } else {
        this.gelbooru(name, show)
      }
    })
  }

  handle () {
    this.responds(/^waifu$/i, () => {
      let data = DB.Waifus
      let char = data[Math.floor(Math.random() * data.length)].split(' || ')
      this.yandere(char[0], char[1])
    })
  }
}

module.exports = Waifu
