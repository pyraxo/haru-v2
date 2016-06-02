'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _Bank = require('../.Cache/Bank');

var _Cockfight = require('../.Cache/Cockfight');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Cockfight = function (_BaseCommand) {
  _inherits(Cockfight, _BaseCommand);

  function Cockfight() {
    _classCallCheck(this, Cockfight);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Cockfight).apply(this, arguments));
  }

  _createClass(Cockfight, [{
    key: 'listen',
    value: function listen() {
      var _this2 = this;

      _Cockfight.Den.once('REQUEST_SENT:' + this.channel.id, function (arena) {
        var player1 = _this2.client.users.get('id', arena.player1);
        var player2 = _this2.client.users.get('id', arena.player2);
        _this2.send(_this2.channel, [player1.mention() + ' challenged ' + player2.mention() + ' to a cockfight!', 'The other party has **60 seconds** to respond with `' + _this2.prefix + 'cockfight ready` ' + 'or they automatically forfeit!'].join('\n'));
      });

      _Cockfight.Den.once('REQUEST_IGNORED:' + this.channel.id, function (arena) {
        _this2.send(_this2.channel, _this2.client.users.get('id', arena.waiting).mention() + ' has forfeited the battle!\n' + 'Guess they **chickened out**, huh...');
        _Cockfight.Den.removeAllListeners('REQUEST_SENT:' + _this2.channel.id);
        _Cockfight.Den.removeAllListeners('BETTING_START:' + _this2.channel.id);
        _Cockfight.Den.removeAllListeners('BETTING_END:' + _this2.channel.id);
        _Cockfight.Den.removeAllListeners('ARENA_START:' + _this2.channel.id);
        _Cockfight.Den.removeAllListeners('ARENA_END:' + _this2.channel.id);
        _Cockfight.Den.removeAllListeners('BETTING_WON:' + _this2.channel.id);
        _Cockfight.Den.removeAllListeners('BETTING_LOST:' + _this2.channel.id);
      });

      _Cockfight.Den.once('BETTING_START:' + this.channel.id, function (arena) {
        _this2.send(_this2.channel, 'The battle will commence in 1 minute!\n' + ('Place your bets by doing `' + _this2.prefix + 'cockfight bet <user> <amount>`!'));
      });

      _Cockfight.Den.once('BETTING_END:' + this.channel.id, function (arena) {
        _this2.send(_this2.channel, 'The betting phase is over! And so, the battle begins!');
      });

      _Cockfight.Den.once('ARENA_START:' + this.channel.id, function (arena) {
        _this2.battle(arena);
      });

      _Cockfight.Den.once('ARENA_END:' + this.channel.id, function (arena, winner, loser) {
        _this2.send(_this2.channel, [_this2.client.users.get('id', winner.id).mention() + ' ' + ('wins the match with their :rooster: **' + winner.name + '**!'), 'They win **1500** credits, sponsored by the loser ' + (_this2.client.users.get('id', loser.id).mention() + '!')].join('\n')).then(function () {
          _Bank.Banker.addCredits(winner.id, 1500);
          _Bank.Banker.delCredits(loser.id, 1500);
        });
      });

      _Cockfight.Den.once('BETTING_WON', function (winner, bets) {
        bets.forEach(function (bet) {
          _Bank.Banker.addCredits(bet.user, bet.amount);
          _this2.send(_this2.channel, ':moneybag:  **' + _this2.client.users.get('id', bet.user).name + '** has won **' + bet.amount + '** credits!');
        });
      });

      _Cockfight.Den.once('BETTING_LOST', function (loser, bets) {
        bets.forEach(function (bet) {
          _Bank.Banker.delCredits(bet.user, bet.amount);
          _this2.send(_this2.channel, ':money_with_wings:  **' + _this2.client.users.get('id', bet.user).name + '** has lost **' + bet.amount + '** credits!');
        });
      });
    }
  }, {
    key: 'battle',
    value: function battle(arena) {
      var _this3 = this;

      _Cockfight.Den.get(arena.player1).then(function (player1) {
        _Cockfight.Den.get(arena.player2).then(function (player2) {
          var channel = arena.id;
          player1.hp = 10;
          player2.hp = 10;
          var name = function name(player) {
            return '[:rooster: **' + player.name + '**]';
          };
          var t1_hit = ['%player1% opens the match with a solid hit to %player2%, dealing %dmg% damage!', '%player1% lands the first strike on %player2%, who suffers %dmg% damage!', '%player2% suffers the first pounding by %player1%, who hits for %dmg% damage!', '%player1% secures a good first hit on %player2%, delivering %dmg% damage!', '%player1% administers a quick %dmg% damage on %player2% to begin the match!'];
          var t1_crit = ['%player1% manages to land a critical strike on its first hit, dealing %dmg% damage to %player2!', '%player1% dispenses a critical first strike, dealing %dmg% damage to %player2%!', 'The match begins with %player1% delivering a critical %dmg% points of damage to %player2%!'];
          var t1_miss = ['%player1% attempts for a first hit, but misses %player2% completely!', 'The match begins with %player1% attempting a good score on %player2% but the latter quickly dodges!', '%player2% dodges %player1%\'s strike, bringing the match to an intense start!'];
          var hit = ['%player1% administers a strong hit to %player2%, dealing %dmg% damage!', '%player1% lands a strike on %player2%, who suffers %dmg% damage!', '%player2% suffers a pounding by %player1%, who hits for %dmg% damage!', '%player1% secures a good hit on %player2%, delivering %dmg% damage!', '%player1% delivers a quick %dmg% damage to %player2%!'];
          var crit = ['%player1% delivers a swift blow to %player2% for an extra damage of %dmg%!', '%player1% lands a critical hit to %player2% for %dmg% damage!', 'Ouch! %player2% suffers a heavy blow by %player1% who hits for %dmg% damage!', '%player1%\'s sudden strike delivers a critical hit on %player2% who suffers %dmg% damage!', '%player2% suffers a critical hit by %player1% of %dmg% damage!'];
          var miss = ['%player1% delivers a quick strike towards %player2%, but alas! They miss by a small margin!', '%player1%\'s swift movements are no match for %player2%, who easily dodges!', '%player2% dodges %player1%\'s hit after hit! What a match!', '%player1% charges towards %player2%, who manages to dodge in the nick of time!'];
          var turns = [player1, player2];
          if (Math.random() <= 0.5) {
            _lodash2.default.reverse(turns);
          }
          var turn = function turn(hit, crit, miss) {
            return new Promise(function (res, rej) {
              switch (_lodash2.default.sample(['hit', 'hit', 'hit', 'crit', 'miss', 'miss'])) {
                case 'hit':
                  _this3.send(channel, _lodash2.default.sample(hit).replace('%player1%', name(turns[0])).replace('%player2%', name(turns[1])).replace('%dmg%', '**' + turns[0].dmg + '**')).then(res);
                  turns[1].hp -= turns[0].dmg;
                  break;
                case 'crit':
                  _this3.send(channel, _lodash2.default.sample(crit).replace('%player1%', name(turns[0])).replace('%player2%', name(turns[1])).replace('%dmg%', '**' + turns[0].dmg * 2 + '**')).then(res);
                  turns[1].hp -= turns[0].dmg * 2;
                  break;
                case 'miss':
                  _this3.send(channel, _lodash2.default.sample(miss).replace('%player1%', name(turns[0])).replace('%player2%', name(turns[1]))).then(res);
                  break;
              }
            });
          };
          var check = function check() {
            if (turns[0].hp > 0 && turns[1].hp > 0) {
              _lodash2.default.reverse(turns);
              setTimeout(function () {
                turn(hit, crit, miss).then(check);
              }, 2000);
            } else {
              var win = function win(winner, loser) {
                winner.wins++;
                winner.hp = 10;
                loser.losses++;
                loser.hp = 10;
                _Cockfight.Den.set(winner.id, winner);
                _Cockfight.Den.set(loser.id, loser);
                _Cockfight.Den.end(channel, winner, loser);
              };
              if (turns[1].hp <= 0) {
                win(turns[0], turns[1]);
              } else if (turns[0].hp <= 0) {
                win(turns[1], turns[0]);
              }
            }
          };
          turn(t1_hit, t1_crit, t1_miss).then(check);
        });
      });
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this4 = this;

      this.responds(/^cockfight$/i, function (matches) {
        _Cockfight.Den.get(_this4.sender.id).then(function (cock) {
          if (!cock) {
            _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, you don\'t own a :rooster: yet!\n' + (':arrows_counterclockwise:  To purchase one, type `' + _this4.prefix + 'cockfight buy`.'));
            return;
          }
          _this4.send(_this4.channel, [':information_source:  **Cockfight Statistics** for **' + _this4.sender.name + '**', '`Name`: **' + cock.name + '** :rooster:', '`Wins`: ' + cock.wins, '`Losses`: ' + cock.losses].join('\n'));
        });
      });

      this.responds(/^cockfight <@!*(\d+)>$/i, function (matches) {
        if (_this4.isPrivate) return false;
        var enemID = matches[1];
        var user = _this4.client.users.get('id', matches[1]);
        if (matches[1] === _this4.sender.id) {
          _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, you can\'t challenge yourself!!');
        }
        if (!user) {
          _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, that user doesn\'t exist in my records!');
          return;
        } else if (user.bot === true) {
          _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, you can\'t challenge bots!');
          return;
        } else if (user.status !== 'online') {
          _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, wait until that user is online to challenge them!');
          return;
        } else if (!_this4.server.members.get('id', matches[1])) {
          _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, that user is not in this server.');
          return;
        } else if (_Cockfight.Den.hasArena(_this4.channel.id)) {
          _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, there\'s a battle ongoing in this channel.');
          return;
        }
        _Cockfight.Den.get(_this4.sender.id).then(function (player) {
          if (!player) {
            _this4.send(_this4.channel, ':negative_squared_cross_mark:  **' + _this4.sender.name + '**, you don\'t own a :rooster: yet!\n' + (':yen:  To buy one, do `' + _this4.prefix + 'cockfight buy`.'));
            return;
          } else if (_Cockfight.Den.isIngame(player.id)) {
            _this4.send(_this4.channel, ':negative_squared_cross_mark:  **' + _this4.sender.name + '**, you\'re in the middle of a battle!');
            return;
          }
          _Cockfight.Den.get(enemID).then(function (enemy) {
            if (!enemy) {
              _this4.send(_this4.channel, ':negative_squared_cross_mark:  **' + _this4.sender.name + '**, that user doesn\'t own a :rooster: yet!');
              return;
            } else if (_Cockfight.Den.isIngame(enemy.id)) {
              _this4.send(_this4.channel, ':negative_squared_cross_mark:  **' + _this4.sender.name + '**, that player is in the middle of a battle!');
              return;
            }
            _Bank.Banker.get(_this4.sender.id, function (err, cred) {
              if (err) {
                _this4.logger.error('Error reading/writing to Redis', err);
                _this4.reply('Error reading/writing to Redis:\n' + err);
                return;
              }
              if (cred < 1500) {
                _this4.send(_this4.channel, ':negative_squared_cross_mark:  **' + _this4.sender.name + '**, you do not have enough credits!\n' + (':yen:  You need **' + (1500 - cred) + '** more credits.'));
                return;
              }
              _Bank.Banker.get(matches[1], function (err, cred) {
                if (err) {
                  _this4.logger.error('Error reading/writing to Redis', err);
                  _this4.reply('Error reading/writing to Redis:\n' + err);
                  return;
                }
                if (cred < 1500) {
                  _this4.send(_this4.channel, ':negative_squared_cross_mark:  **' + _this4.sender.name + '**, that user does not have enough credits to fight you!');
                  return;
                }
              });
              _this4.listen();
              var arena = new _Cockfight.Arena({
                id: _this4.channel.id,
                player1: player.id,
                player2: enemy.id,
                waiting: enemy.id
              });
              _Cockfight.Den.register(_this4.channel.id, arena);
            });
          });
        });
      });

      this.responds(/^cockfight rename$/i, function (matches) {
        _Cockfight.Den.get(_this4.sender.id).then(function (cock) {
          if (!cock) {
            _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, you don\'t own a :rooster: yet!\n' + (':arrows_counterclockwise:  To purchase one, type `' + _this4.prefix + 'cockfight buy`.'));
            return;
          }
          _this4.await(_this4.message, ':information_source:  **' + _this4.sender.name + '**, what would you like to rename your :rooster: to?', function (msg) {
            return (/^(.+)$/.test(msg.content)
            );
          }).then(function (msg) {
            _this4.send(_this4.channel, 'Nice name! ' + _this4.sender.name + '\'s :rooster: is now called **' + msg.content + '**!');
            cock.name = msg.content;
            _Cockfight.Den.set(_this4.sender.id, cock);
          });
        });
      });

      this.responds(/^cockfight buy$/i, function (matches) {
        _Cockfight.Den.get(_this4.sender.id).then(function (cock) {
          if (cock) {
            _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, you already own a :rooster: named **' + cock.name + '**!');
            return;
          }
          _Bank.Banker.getUser(_this4.sender, function (err, credits) {
            if (err) {
              _this4.logger.error('Error reading/writing to Redis', err);
              _this4.reply('Error reading/writing to Redis:\n' + err);
              return;
            }
            credits = parseInt(credits, 10);
            if (credits < 5000) {
              _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, you need **5000** credits to buy a :rooster: .\n' + ('You only have **' + credits + '**.'));
              return;
            }
            _Bank.Banker.delCredits(_this4.sender, 5000);
            _this4.await(_this4.message, ['**' + _this4.sender.name + '** bought a new :rooster: for **5000** credits!', 'Time to give it a new name. What will you name it?'].join('\n'), function (msg) {
              return (/^(.+)$/.test(msg.content)
              );
            }).then(function (msg) {
              _this4.send(_this4.channel, 'Nice name! **' + _this4.sender.name + '**\'s new :rooster: is now called **' + msg.content + '**!');
              var cock = new _Cockfight.Cock({ id: _this4.sender.id, name: msg.content });
              _Cockfight.Den.set(_this4.sender.id, cock).catch(function (err) {
                if (err) {
                  _this4.logger.error('Unable to create cockfight entry', err);
                  _this4.reply(['Unable to create Cockfights entry: ' + err, 'Your credits will be refunded.'].join('\n'));
                  _Bank.Banker.addCredits(_this4.sender, 5000);
                  return;
                }
              });
            });
          });
        });
      });

      this.responds(/^cockfight ready$/i, function (matches) {
        if (_this4.isPrivate) return false;
        var arena = _Cockfight.Den.getArena(_this4.channel.id);
        if (!arena) {
          _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, no one has challenged you to a cockfight yet!\n' + ('To challenge someone, do `' + _this4.prefix + 'cockfight fight <user>`'));
          return;
        }
        if (arena.waiting !== _this4.sender.id) {
          _this4.send(_this4.channel, ':information_source:  We aren\'t waiting for your response, **' + _this4.sender.name + '**!');
          return;
        }
        _Cockfight.Den.accepted(_this4.channel.id);
        _this4.send(_this4.channel, ':white_check_mark: **' + _this4.sender.name + '** has declared himself ready!');
      });

      this.responds(/^cockfight bet <@!*(\d+)> (\d+)$/i, function (matches) {
        if (_this4.isPrivate) return false;
        var amount = parseInt(matches[2], 10);
        var arena = _Cockfight.Den.getArena(_this4.channel.id);
        if (_this4.sender.id === arena.player1 || _this4.sender.id === arena.player2) {
          _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, you\'re a participant of this battle!');
          return;
        }
        if (!arena) {
          _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, there\'s no battle going on in this server!');
          return;
        }
        if (arena.state !== 'betting') {
          _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, it isn\'t the betting phase for this battle!');
          return;
        }
        if (matches[1] !== arena.player1 && matches[1] !== arena.player2) {
          _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '**, that user isn\'t a participant of this battle!');
          return;
        }
        _Bank.Banker.getUser(_this4.sender, function (err, credits) {
          if (err) {
            _this4.logger.error(_this4.sender.name + ' met an error fetching credits', err);
            _this4.reply('Error fetching credits:\n' + err);
            return;
          }
          if (amount > 5000) {
            amount = 5000;
            _this4.send(_this4.channel, ':arrows_counterclockwise:  **${this.sender.name}**,  maximum bet is **5000** credits. Betting that amount.');
          }
          if (credits < amount) {
            _this4.send(_this4.channel, ':negative_squared_cross_mark:  **' + _this4.sender.name + '**, you do not have enough credits to bet **' + amount + '** credits!\n' + (':information_source:  You\'ll need **' + (amount - credits) + '** more credits.'));
            return;
          }
          _Cockfight.Den.placeBet(_this4.channel.id, matches[1], {
            user: _this4.sender.id,
            amount: amount
          });
          _this4.send(_this4.channel, ':information_source:  **' + _this4.sender.name + '** placed a bet of **' + amount + '** credits on **' + _this4.client.users.get('id', matches[1]).name + '**!');
        });
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'cockfight';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Game of Cockfights';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['```rb', '== COCKFIGHTS ==', '```', ['cockfight <user> - Engages in a cockfight with a user!', 'cockfight buy - Buys a :rooster: !', 'cockfight bet <user> <amount> - Bets on a user during a battle!', 'cockfight rename - Allows you to rename a :rooster: !']];
    }
  }]);

  return Cockfight;
}(_BaseCommand3.default);

module.exports = Cockfight;
//# sourceMappingURL=cockfight.js.map
