import redis from 'redis'
import path from 'path'

import FDB from './FlatDatabase'

class SortedDatabase {
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

  set (member, score, cb) {
    this.client.zadd(this.key, parseInt(score, 10), member, (err, res) => {
      return this._handle(cb, err, res)
    })
  }

  get (member, cb) {
    this.client.zscore(this.key, member, (err, res) => {
      return this._handle(cb, err, res)
    })
  }

  del (member, cb) {
    this.client.zrem(this.key, member, (err, res) => {
      return this._handle(cb, err, res)
    })
  }

  incr (member, incr, cb) {
    this.client.zincrby(this.key, parseInt(incr, 10), member, (err, res) => {
      return this._handle(cb, err, res)
    })
  }

  getTotal (field, cb) {
    this.client.zcard(this.key, (err, res) => {
      return this._handle(cb, err, res)
    })
  }

  getRankFromLowest (member, cb) {
    this.client.zrank(this.key, member, (err, res) => {
      return this._handle(cb, err, res)
    })
  }

  getRankFromHighest (member, cb) {
    this.client.zrevrank(this.key, member, (err, res) => {
      return this._handle(cb, err, res)
    })
  }
}

module.exports = SortedDatabase
