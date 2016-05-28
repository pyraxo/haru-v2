import redis from 'redis'
import path from 'path'

import FDB from './FlatDatabase'

class Database {
  constructor (key, options) {
    options = options || new FDB(path.join(process.cwd(), 'config/redis.json'))
    this.key = key
    this.client = redis.createClient(options.getAll())
  }

  _handle (cb, err, res) {
    if (typeof cb === 'function') {
      if (err) return cb(err, res)
      return cb(null, res)
    }
  }

  set (field, value, cb) {
    if (typeof value === 'object') value = JSON.stringify(value)
    this.client.hset(this.key, field, value, (err, res) => {
      return this._handle(cb, err, res)
    })
  }

  get (field, cb) {
    this.client.hget(this.key, field, (err, res) => {
      return this._handle(cb, err, JSON.parse(res))
    })
  }

  has (field, cb) {
    this.client.hexists(this.key, field, (err, res) => {
      return this._handle(cb, err, res)
    })
  }

  del (field, cb) {
    this.client.hdel(this.key, field, (err, res) => {
      return this._handle(cb, err, res)
    })
  }

  getKeys (cb) {
    this.client.hkeys(this.key, (err, res) => {
      return this._handle(cb, err, res)
    })
  }
}

module.exports = Database
