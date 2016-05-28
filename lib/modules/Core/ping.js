'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _tcpPing = require('tcp-ping');

var _tcpPing2 = _interopRequireDefault(_tcpPing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PingCommand = function (_BaseCommand) {
  _inherits(PingCommand, _BaseCommand);

  function PingCommand() {
    _classCallCheck(this, PingCommand);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PingCommand).apply(this, arguments));
  }

  _createClass(PingCommand, [{
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^ping$/i, function () {
        _this2.reply('Pong!');
      });

      this.responds(/^ping (.+)$/i, function (matches) {
        _this2.send(_this2.channel, ':mag:  Pinging **' + matches[1] + '**').then(function (msg) {
          _tcpPing2.default.ping({
            address: matches[1]
          }, function (err, data) {
            if (err || !data.avg) {
              _this2.client.updateMessage(msg, ':negative_squared_cross_mark:  Pinging failed! ' + ('**' + (err || 'Connection not found!') + '**'));
              return;
            }
            _this2.client.updateMessage(msg, [':white_check_mark:  Pinged **' + matches[1] + '**', '```xl', 'address: ' + matches[1], 'port: 80', 'attempts: 10', 'avg: ' + data.avg.toPrecision(3) + ' ms', 'max: ' + data.max.toPrecision(3) + ' ms', 'min: ' + data.min.toPrecision(3) + ' ms', '```'].join('\n'));
          });
        });
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'ping';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Pong!';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['```', ['ping - Pong!', 'ping [address] - Pings an address with output'], '```'];
    }
  }]);

  return PingCommand;
}(_BaseCommand3.default);

module.exports = PingCommand;
//# sourceMappingURL=ping.js.map
