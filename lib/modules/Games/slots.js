'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _Bank = require('../.Cache/Bank');

var _RateLimiter = require('../.Cache/RateLimiter');

var _RateLimiter2 = _interopRequireDefault(_RateLimiter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Slots = function (_BaseCommand) {
  _inherits(Slots, _BaseCommand);

  function Slots() {
    _classCallCheck(this, Slots);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Slots).apply(this, arguments));
  }

  _createClass(Slots, [{
    key: 'spin',
    value: function spin(bet) {
      var _this2 = this;

      var symbols = this.symbols;
      if (_RateLimiter2.default.isLimited(this.sender)) {
        this.client.deleteMessage(this.message);
        return this.reply('Calm down, you\'re spamming `' + this.prefix + 'slots` too quickly!', {
          deleteDelay: 3000
        });
      }
      _RateLimiter2.default.inc(this.sender);
      if (bet <= 0) bet = 1;
      if (bet > 100) bet = 100;
      _Bank.Banker.getUser(this.sender, function (err, credits) {
        if (err) {
          _this2.logger.error(_this2.sender.name + ' met an error fetching credits', err);
          _this2.reply('Error fetching credits amount:\n' + err);
          return;
        }
        credits = parseInt(credits, 10);
        if (credits === 0) {
          _this2.reply('You have no remaining funds.');
          return;
        } else if (credits < bet) {
          _this2.reply('You have insufficient funds of only **' + credits + '** credit(s).\n' + ('Out of credits? You can use `' + _this2.prefix + 'credits claim` to ') + 'get credits every 24 hours');
          return;
        }
        _Bank.Banker.delCredits(_this2.sender, bet, function (err, res) {
          if (err) {
            _this2.logger.error(_this2.sender.name + ' met an error removing credits', err);
            _this2.reply('Error removing credits amount:\n' + err);
            return;
          }
          var machine = [];
          for (var i = 0; i < 3; i++) {
            var sample = [];
            while (sample.length < 3) {
              sample = _lodash2.default.uniq(_lodash2.default.sampleSize(symbols, 3));
            }
            machine.push(sample);
          }
          var payline = [machine[0][1], machine[1][1], machine[2][1]];
          _this2.send(_this2.channel, ['**__   S   L   O   T   S   __**', '|| ' + machine[0][0] + ' ' + machine[1][0] + ' ' + machine[2][0] + ' ||', '> ' + payline.join(' ') + ' <', '|| ' + machine[0][2] + ' ' + machine[1][2] + ' ' + machine[2][2] + ' ||', '\n**' + _this2.sender.name + '** used **' + bet + '** credit(s) and...'].join('\n')).then(function (msg) {
            _this2.checkWins(payline, bet).then(function (amount) {
              var message = ' won **' + amount + '** credits! Congratulations!';
              _this2.client.updateMessage(msg, msg.content.substring(0, msg.content.length - 3) + message);
              _Bank.Banker.addCredits(_this2.sender, amount, function (err, res) {
                if (err) {
                  _this2.logger.error(_this2.sender.name + ' met an error adding credits', err);
                  _this2.reply('Error adding credits amount:\n' + err);
                  return;
                }
              });
            }).catch(function () {
              _this2.client.updateMessage(msg, msg.content.substring(0, msg.content.length - 3) + ' didn\'t win anything. Better luck next time!');
            });
          });
        });
      });
    }
  }, {
    key: 'checkWins',
    value: function checkWins(payline, bet) {
      var payout = this.wins;
      return new Promise(function (res, rej) {
        var report = _lodash2.default.countBy(payline);
        var reward = 0;
        Object.keys(report).forEach(function (elem, idx) {
          var win = payout['' + elem + report[elem]];
          reward += win ? win * bet : 0;
        });
        if (reward > 0) return res(reward);
        return rej();
      });
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this3 = this;

      this.responds(/^slots$/i, function () {
        _this3.spin(1);
      });

      this.responds(/^slots (\d+)$/i, function (matches) {
        var bet = matches[1];
        _this3.spin(bet);
      });
    }
  }, {
    key: 'symbols',
    get: function get() {
      return ['🍒', '🍒', '🍒', '7⃣', '🍐', '🍐', '🍐', '🍐', '🇱🇻', '🇱🇻', '🍈', '🍈', '🍈', '🍈', '🍇', '🍇', '🍇', '🍇', '🍊', '🍊', '🍊', '🍊', '💎', '🍉', '🍉', '🍉', '🍉', '🔔'];
    }
  }, {
    key: 'wins',
    get: function get() {
      return {
        '🍒1': 2,
        '🍒2': 5,
        '🍒3': 10,
        '7⃣2': 50,
        '7⃣3': 150,
        '🍐3': 20,
        '🍈3': 20,
        '🍇3': 20,
        '🍊3': 20,
        '💎2': 25,
        '💎3': 200,
        '🔔3': 50,
        '🍉3': 20,
        '🇱🇻2': 40,
        '🇱🇻3': 100
      };
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'slots';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Slot machine game';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['```rb', '== SLOTS ==', '```', ['slots [amount] - Spins with the amount of wager, min 1 max 100']];
    }
  }]);

  return Slots;
}(_BaseCommand3.default);

module.exports = Slots;
//# sourceMappingURL=slots.js.map
