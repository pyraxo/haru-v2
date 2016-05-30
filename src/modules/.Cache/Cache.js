class Cache {
  constructor () {
    this.db = {}
  }

  add (id, val) {
    this.db[id] = val
    return this.db
  }

  get (id) {
    return this.db[id]
  }

  has (id) {
    return typeof this.db[id] !== 'undefined'
  }
}

let cache = new Cache()
module.exports = cache
