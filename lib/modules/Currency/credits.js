'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _Bank = require('../.Cache/Bank');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Credits = function (_BaseCommand) {
  _inherits(Credits, _BaseCommand);

  function Credits() {
    _classCallCheck(this, Credits);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Credits).apply(this, arguments));
  }

  _createClass(Credits, [{
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^credits$/i, function () {
        _Bank.Banker.getUser(_this2.sender, function (err, amt) {
          if (err) {
            _this2.logger.error(_this2.sender.name + ' met an error fetching credits', err);
            _this2.reply('Error fetching credits amount:\n' + err);
            return;
          }
          _this2.reply('You have **' + parseInt(amt, 10) + '** credits.');
        });
      });

      this.responds(/^credits (leaderboards|lb|rankings)$/i, function () {
        _Bank.Banker.sortRank(10, function (err, res) {
          if (err) {
            _this2.logger.error(_this2.sender.name + ' met an error fetching credits rankings', err);
            _this2.reply('Error fetching credits leaderboard:\n' + err);
            return;
          }
          var ranking = ['```rb', '== DISCORD WEALTH RANKINGS =='];
          for (var i = 0, j = 1; i < Math.min(res.length, 20); i += 2, j++) {
            ranking.push([j + '. ' + _this2.client.users.get('id', res[i]).name + ' - ' + res[i + 1] + ' credits']);
          }
          ranking.push('```');
          _this2.send(_this2.channel, ranking.join('\n'));
        });
      });

      this.responds(/^credits (give|send) <@!*(\d+)> (\d+)(\s.+)*$/i, function (matches) {
        var amt = parseInt(matches[3], 10);
        var recipient = _this2.client.users.get('id', matches[2]);
        if (recipient) {
          _Bank.Banker.getUser(_this2.sender, function (err, res) {
            if (err) {
              _this2.logger.error(_this2.sender.name + ' met an error fetching credits', err);
              _this2.reply('Error fetching credits amount:\n' + err);
              return;
            }
            if (res) {
              if (parseInt(res, 10) < amt) {
                _this2.reply('You have insufficient (**' + res + '**) credits.');
                return;
              } else {
                _Bank.Banker.delCredits(_this2.sender, matches[3], function (err, res) {
                  if (err) {
                    _this2.logger.error(_this2.sender.name + ' met an error removing credits', err);
                    _this2.reply('Error removing credits:\n' + err);
                    return;
                  }
                  _Bank.Banker.addCredits(matches[2], matches[3], function (err, res) {
                    if (err) {
                      _this2.logger.error(_this2.sender.name + ' met an error sending credits', err);
                      _this2.reply('Error sending credits:\n' + err);
                      return;
                    }
                    var receipt = ['```ruby', '=== RECEIPT ===', 'FROM: ' + _this2.sender.name, 'AMOUNT: ' + amt + ' credits', 'FOR: ' + recipient.name];
                    if (matches[4]) {
                      receipt.push('DESCRIPTION: ' + matches[4]);
                    }
                    receipt.push('```');
                    _this2.send(recipient, receipt.join('\n'));
                    _this2.reply('Sent ' + recipient.mention() + ' **' + amt + '** credits.');
                  });
                });
              }
            }
          });
        }
      });

      this.responds(/^credits peek <@!*(\d+)>$/i, function (matches) {
        var user = _this2.client.users.get('id', matches[1]);
        if (user) {
          _Bank.Banker.getUser(matches[1], function (err, res) {
            if (err) {
              _this2.logger.error(_this2.sender.name + ' met an error fetching credits', err);
              _this2.reply('Error fetching credits amount:\n' + err);
              return;
            }
            _this2.reply('**' + user.name + '** has **' + parseInt(res, 10) + '** credits.');
          });
        }
      });

      this.responds(/^credits claim/i, function () {
        _Bank.Claims.get(_this2.sender.id, function (err, res) {
          if (err) {
            _this2.logger.error(_this2.sender.name + ' met an error fetching credit claims DB', err);
            _this2.reply('Error fetching credit claims DB:\n' + err);
            return;
          }
          var amount = Math.floor(Math.random() * 400) + 100;
          if (res) {
            var diff = (0, _moment2.default)().diff((0, _moment2.default)(res), 'hours');
            if (diff < 24) {
              _this2.reply('You have claimed your daily credits.\n' + ('Check back after **' + (24 - diff) + '** hours.'));
              return;
            } else {
              _Bank.Claims.set(_this2.sender.id, +(0, _moment2.default)(), function (err, res) {
                if (err) {
                  _this2.logger.error(_this2.sender.name + ' met an error resetting claim timer', err);
                  _this2.reply('Error resetting claim timer:\n' + err);
                  return;
                }
              });
              _Bank.Banker.addCredits(_this2.sender, amount, function (err, res) {
                if (err) {
                  _this2.logger.error(_this2.sender.name + ' met an error claiming credits', err);
                  _this2.reply('Error claiming credits:\n' + err);
                  return;
                }
                _this2.send(_this2.channel, '**' + amount + '** credits added to ' + _this2.sender.mention() + '\'s account.');
              });
            }
          } else {
            _Bank.Claims.set(_this2.sender.id, +(0, _moment2.default)(), function (err, res) {
              if (err) {
                _this2.logger.error(_this2.sender.name + ' met an error resetting claim timer', err);
                _this2.reply('Error resetting claim timer:\n' + err);
                return;
              }
            });
            _Bank.Banker.setCredits(_this2.sender, amount + 100, function (err, res) {
              if (err) {
                _this2.logger.error(_this2.sender.name + ' met an error claiming credits', err);
                _this2.reply('Error claiming credits:\n' + err);
                return;
              }
              _this2.send(_this2.channel, '**' + amount + '** credits added to ' + _this2.sender.mention() + '\'s account.');
            });
          }
        });
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'credits';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Currency system';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['```', '== Credits Management System ==', '```', 'Credits are a virtual currency that can be used in any server the bot is in.', ['**give** <user> <no. of credits> [message] - Sends credits to a user', '**peek** <user> - Takes a peek at a user\'s number of credits', '**lb** - Gets the rankings for credit amounts', '**claim** - Claims your daily credits, usable every 24 hours']];
    }
  }]);

  return Credits;
}(_BaseCommand3.default);

module.exports = Credits;
//# sourceMappingURL=credits.js.map
