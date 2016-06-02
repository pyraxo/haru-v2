import { EventEmitter } from 'events'
import _ from 'lodash'

import Database from '../../../util/Database'

let Cockfights = new Database('cockfights')

class Den extends EventEmitter {
  constructor () {
    super()
    this.listen()
    this.arenas = {}
    this.players = []
  }

  listen () {
    this.on('REQUEST_SENT', id => {
      setTimeout(() => {
        if (this.hasArena(id)) {
          let arena = this.getArena(id)
          if (this.getArena(id).state === 'waiting') {
            this.emit('REQUEST_IGNORED:' + id, arena)
            this.emit('REQUEST_IGNORED', id)
          }
        }
      }, 60000)
    })

    this.on('REQUEST_IGNORED', id => {
      this.deleteArena(id)
    })

    this.on('BETTING_START', id => {
      let arena = this.getArena(id)
      if (arena) {
        setTimeout(() => {
          this.emit('BETTING_END:' + id, arena)
          this.emit('BETTING_END', id)
        }, 60000)
      }
    })

    this.on('BETTING_END', id => {
      this.start(id)
    })

    this.on('ARENA_START', id => {
      let arena = this.getArena(id)
      if (arena) {
        // Empty, probably
      }
    })

    this.on('ARENA_END', id => {
      let arena = this.getArena(id)
      if (arena) {
        setTimeout(() => {
          this.deleteArena(id)
        }, 10000)
      }
    })
  }

  get (id) {
    return new Promise((res, rej) => {
      Cockfights.get(id, (err, result) => {
        if (err) return rej(err)
        res(result)
      })
    })
  }

  set (id, val) {
    return new Promise((res, rej) => {
      Cockfights.set(id, val, (err, result) => {
        if (err) return rej(err)
        res(result)
      })
    })
  }

  register (id, arena) {
    arena.state = 'waiting'
    this.save(id, arena)
    this.players.push(arena.player1)
    this.players.push(arena.player2)
    this.emit('REQUEST_SENT:' + id, arena)
    this.emit('REQUEST_SENT', id)
  }

  getArena (id) {
    return this.arenas[id]
  }

  hasArena (id) {
    return typeof this.arenas[id] !== 'undefined'
  }

  isIngame (id) {
    return this.players.indexOf(id) > -1
  }

  deleteArena (id) {
    let arena = this.getArena(id)
    if (arena) {
      _.pull(this.players, arena.player1, arena.player2)
      delete this.arenas[id]
    } else {
      return false
    }
  }

  accepted (id) {
    let arena = this.getArena(id)
    if (arena) {
      arena.waiting = null
      arena.state = 'betting'
      arena.bets[arena.player1] = []
      arena.bets[arena.player2] = []
      this.save(id, arena)
      this.emit('BETTING_START:' + id, arena)
      this.emit('BETTING_START', id)
    } else {
      return false
    }
  }

  start (id) {
    let arena = this.getArena(id)
    if (arena) {
      arena.state = 'ingame'
      this.save(id, arena)
      this.emit('ARENA_START:' + id, arena)
      this.emit('ARENA_START', id)
    } else {
      return false
    }
  }

  end (id, winner, loser) {
    let arena = this.getArena(id)
    if (arena) {
      arena.state = 'idle'
      this.save(id, arena)
      this.emit('ARENA_END:' + id, arena, winner, loser)
      this.emit('ARENA_END', id)
      this.emit('BETTING_WON', winner, arena.bets[winner.id])
      this.emit('BETTING_LOST', loser, arena.bets[loser.id])
    } else {
      return false
    }
  }

  placeBet (id, player, bet) {
    let arena = this.getArena(id)
    if (arena) {
      switch (player) {
        case arena.player1:
          arena.bets[arena.player1].push(bet)
          break
        case arena.player2:
          arena.bets[arena.player2].push(bet)
          break
        default:
          return false
      }
      this.save(id, arena)
    } else {
      return false
    }
  }

  save (id, arena) {
    this.arenas[id] = arena
  }
}

module.exports = Den
