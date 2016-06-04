'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Database = require('../../../util/Database');

var _Database2 = _interopRequireDefault(_Database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cockfights = new _Database2.default('cockfights');

var Den = function (_EventEmitter) {
  _inherits(Den, _EventEmitter);

  function Den() {
    _classCallCheck(this, Den);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Den).call(this));

    _this.listen();
    _this.arenas = {};
    _this.players = [];
    return _this;
  }

  _createClass(Den, [{
    key: 'listen',
    value: function listen() {
      var _this2 = this;

      this.on('REQUEST_SENT', function (id) {
        setTimeout(function () {
          if (_this2.hasArena(id)) {
            var arena = _this2.getArena(id);
            if (_this2.getArena(id).state === 'waiting') {
              _this2.emit('REQUEST_IGNORED:' + id, arena);
              _this2.emit('REQUEST_IGNORED', id);
            }
          }
        }, 60000);
      });

      this.on('REQUEST_IGNORED', function (id) {
        _this2.deleteArena(id);
      });

      this.on('BETTING_START', function (id) {
        var arena = _this2.getArena(id);
        if (arena) {
          setTimeout(function () {
            _this2.emit('BETTING_END:' + id, arena);
            _this2.emit('BETTING_END', id);
          }, 60000);
        }
      });

      this.on('BETTING_END', function (id) {
        _this2.start(id);
      });

      this.on('ARENA_START', function (id) {
        var arena = _this2.getArena(id);
        if (arena) {
          // Empty, probably
        }
      });

      this.on('ARENA_END', function (id) {
        var arena = _this2.getArena(id);
        if (arena) {
          setTimeout(function () {
            _this2.deleteArena(id);
          }, 10000);
        }
      });
    }
  }, {
    key: 'get',
    value: function get(id) {
      return new Promise(function (res, rej) {
        Cockfights.get(id, function (err, result) {
          if (err) return rej(err);
          res(result);
        });
      });
    }
  }, {
    key: 'set',
    value: function set(id, val) {
      return new Promise(function (res, rej) {
        Cockfights.set(id, val, function (err, result) {
          if (err) return rej(err);
          res(result);
        });
      });
    }
  }, {
    key: 'register',
    value: function register(id, arena) {
      arena.state = 'waiting';
      this.save(id, arena);
      this.players.push(arena.player1);
      this.players.push(arena.player2);
      this.emit('REQUEST_SENT:' + id, arena);
      this.emit('REQUEST_SENT', id);
    }
  }, {
    key: 'getArena',
    value: function getArena(id) {
      return this.arenas[id];
    }
  }, {
    key: 'hasArena',
    value: function hasArena(id) {
      return typeof this.arenas[id] !== 'undefined';
    }
  }, {
    key: 'isIngame',
    value: function isIngame(id) {
      return this.players.indexOf(id) > -1;
    }
  }, {
    key: 'deleteArena',
    value: function deleteArena(id) {
      var arena = this.getArena(id);
      if (arena) {
        _lodash2.default.pull(this.players, arena.player1, arena.player2);
        delete this.arenas[id];
      } else {
        return false;
      }
    }
  }, {
    key: 'accepted',
    value: function accepted(id) {
      var arena = this.getArena(id);
      if (arena) {
        arena.waiting = null;
        arena.state = 'betting';
        arena.bets[arena.player1] = [];
        arena.bets[arena.player2] = [];
        this.save(id, arena);
        this.emit('BETTING_START:' + id, arena);
        this.emit('BETTING_START', id);
      } else {
        return false;
      }
    }
  }, {
    key: 'start',
    value: function start(id) {
      var arena = this.getArena(id);
      if (arena) {
        arena.state = 'ingame';
        this.save(id, arena);
        this.emit('ARENA_START:' + id, arena);
        this.emit('ARENA_START', id);
      } else {
        return false;
      }
    }
  }, {
    key: 'end',
    value: function end(id, winner, loser) {
      var arena = this.getArena(id);
      if (arena) {
        arena.state = 'idle';
        this.save(id, arena);
        this.emit('ARENA_END:' + id, arena, winner, loser);
        this.emit('ARENA_END', id);
        this.emit('BETTING_WON', winner, arena.bets[winner.id]);
        this.emit('BETTING_LOST', loser, arena.bets[loser.id]);
      } else {
        return false;
      }
    }
  }, {
    key: 'placeBet',
    value: function placeBet(id, player, bet) {
      var arena = this.getArena(id);
      if (arena) {
        switch (player) {
          case arena.player1:
            {
              arena.bets[arena.player1].push(bet);
              break;
            }
          case arena.player2:
            {
              arena.bets[arena.player2].push(bet);
              break;
            }
          default:
            return false;
        }
        this.save(id, arena);
      } else {
        return false;
      }
    }
  }, {
    key: 'save',
    value: function save(id, arena) {
      this.arenas[id] = arena;
    }
  }]);

  return Den;
}(_events.EventEmitter);

module.exports = Den;
//# sourceMappingURL=Den.js.map
