'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Stocks = function (_BaseCommand) {
  _inherits(Stocks, _BaseCommand);

  function Stocks() {
    _classCallCheck(this, Stocks);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Stocks).apply(this, arguments));
  }

  _createClass(Stocks, [{
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^stocks (.+)$/i, function (matches) {
        var symbol = matches[1];
        _superagent2.default.get('http://www.google.com/finance/info?q=' + symbol).end(function (err, res) {
          if (err) {
            _this2.logger.error('Error fetching stock $' + symbol.toUpperCase() + ': ', err);
            return _this2.reply('**Error**: Stock $' + symbol.toUpperCase() + ' met with ' + err);
          }
          res = JSON.parse(res.text.replace('//', ''))[0];
          _this2.send(_this2.channel, ['```xl', res.e + ':' + res.t, '```', '**Current price**: ' + res.l, '**Change**: ' + res.c + ' (' + res.cp + '%)', '**Last update**: ' + res.ltt].join('\n'));
        });
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'stocks';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Fetches certain stock from ticker symbols';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**stocks** <symbol> - Fetches the specific stock']];
    }
  }]);

  return Stocks;
}(_BaseCommand3.default);

module.exports = Stocks;
//# sourceMappingURL=stocks.js.map
