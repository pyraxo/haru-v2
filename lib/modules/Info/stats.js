'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Statistics = function (_BaseCommand) {
  _inherits(Statistics, _BaseCommand);

  function Statistics() {
    _classCallCheck(this, Statistics);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Statistics).apply(this, arguments));
  }

  _createClass(Statistics, [{
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^stats$/i, function () {
        var uptime = _this2.client.uptime;
        var usage = process.memoryUsage();
        _this2.send(_this2.channel, ['```xl', '== Statistics ==', 'Uptime: ' + Math.round(uptime / (1000 * 60 * 60)) + ' hours, ' + (Math.round(uptime / (1000 * 60)) % 60 + ' minutes, ') + (Math.round(uptime / 1000) % 60 + ' seconds'), 'Cached: ' + _this2.client.servers.length + ' servers, ' + (_this2.client.channels.length + ' channels, ') + (_this2.client.users.length + ' users.'), 'RAM Usage: ' + Math.round(usage.rss / 1000000) + ' MB', 'Heap Usage: ' + Math.round(usage.heapUsed / 1000000) + ' MB / ' + (Math.round(usage.heapTotal / 1000000) + ' MB'), '```'].join('\n'));
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
