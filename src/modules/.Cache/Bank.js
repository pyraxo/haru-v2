import SDB from '../../util/SortedDatabase'
import Database from '../../util/Database'

let Claims = new Database('credits-claims')

class Bank extends SDB {
  constructor () {
    super('credits')
  }

  initUser (user, cb) {
    if (typeof user === 'object') user = user.id
    this.set(user, 100, (err, res) => {
      cb(err, 100)
    })
  }

  getUser (user, cb) {
    if (typeof user === 'object') user = user.id
    this.get(user, (err, res) => {
      if (!err) {
        if (res) {
          cb(null, res)
        } else {
          this.initUser(user, cb)
        }
      }
    })
  }

  setCredits (user, amt, cb) {
    if (typeof user === 'object') user = user.id
    this.set(user, parseInt(amt, 10), cb)
  }

  addCredits (user, amt, cb) {
    if (typeof user === 'object') user = user.id
    this.incr(user, parseInt(amt, 10), cb)
  }

  delCredits (user, amt, cb) {
    this.addCredits(user, parseInt(-amt, 10), cb)
  }

  sortRank (top, cb) {
    this.client.zrevrange(this.key, 0, parseInt(top, 10) - 1, 'withscores', (err, res) => {
      if (typeof cb === 'function') {
        if (err) return cb(err, res)
        return cb(null, res)
      }
    })
  }
}

let CM = new Bank()
module.exports = {
  Banker: CM,
  Claims: Claims
}