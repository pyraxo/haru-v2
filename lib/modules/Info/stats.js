'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _Database = require('../../util/Database');

var _Database2 = _interopRequireDefault(_Database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Stats = new _Database2.default('stats');

var Statistics = function (_BaseCommand) {
  _inherits(Statistics, _BaseCommand);

  function Statistics() {
    _classCallCheck(this, Statistics);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Statistics).apply(this, arguments));
  }

  _createClass(Statistics, [{
    key: 'checkEntries',
    value: function checkEntries(entry, cb) {
      var _this2 = this;

      Stats.has(entry, function (err, res) {
        if (err) {
          _this2.logger.error(_this2.sender.name + ' encountered an error querying entry', err);
          _this2.reply('Error querying for entries: ' + err);
          return;
        }
        return cb(res);
      });
    }
  }, {
    key: 'getEntry',
    value: function getEntry(entry, cb) {
      var _this3 = this;

      Stats.get(entry, function (err, tags) {
        if (err) {
          _this3.logger.error(_this3.sender.name + ' encountered an error fetching entry', err);
          _this3.reply('Error fetching entry: ' + err);
          return;
        }
        return cb(tags);
      });
    }
  }, {
    key: 'setEntry',
    value: function setEntry(entry, value, cb) {
      var _this4 = this;

      Stats.set(entry, value, function (err) {
        if (err) {
          _this4.logger.error(_this4.sender.name + ' encountered an error saving an entry', err);
          _this4.reply('Error saving entry: ' + err);
          return;
        }
        return cb(true);
      });
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this5 = this;

      this.responds(/^stats$/i, function () {
        var uptime = _this5.client.uptime;
        _this5.send(_this5.channel, ['```xl', '== Statistics ==', 'Uptime: ' + Math.round(uptime / (1000 * 60 * 60)) + ' hours, ' + (Math.round(uptime / (1000 * 60)) % 60 + ' minutes, ') + (Math.round(uptime / 1000) % 60 + ' seconds'), 'Cached: ' + _this5.client.servers.length + ' servers, ' + (_this5.client.channels.length + ' channels, ') + (_this5.client.users.length + ' users.'), '```'].join('\n'));
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'stats';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Shows some statistics';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**stats** - Shows some statistics']];
    }
  }]);

  return Statistics;
}(_BaseCommand3.default);

module.exports = Statistics;
//# sourceMappingURL=stats.js.map
