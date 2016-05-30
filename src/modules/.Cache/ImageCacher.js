class ImageCacher {
  constructor () {
    this.img = {}
  }

  add (id, img) {
    this.img[id] = img
    return this.img
  }

  get (id) {
    return this.img[id]
  }

  has (id) {
    return typeof this.img[id] !== 'undefined'
  }
}

let IC = new ImageCacher()
module.exports = IC
