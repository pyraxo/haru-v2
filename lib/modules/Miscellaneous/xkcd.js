'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XKCD = function (_BaseCommand) {
  _inherits(XKCD, _BaseCommand);

  function XKCD() {
    _classCallCheck(this, XKCD);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(XKCD).apply(this, arguments));
  }

  _createClass(XKCD, [{
    key: 'fetchComic',
    value: function fetchComic(id) {
      var _this2 = this;

      _superagent2.default.get('http://xkcd.com/' + id + '/info.0.json').end(function (err, res) {
        if (err) {
          _this2.logger.error('Error fetching XKCD comic: ', err);
          return _this2.reply('**Error**: XKCD query returned no pictures.');
        }
        return _this2.send(_this2.channel, ['**' + res.body.title + '**', '*' + res.body.alt + '*', res.body.img].join('\n'));
      });
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this3 = this;

      this.responds(/^xkcd$/i, function () {
        var max = 1600;
        _superagent2.default.get('http://xkcd.com/info.0.json').end(function (err, res) {
          if (!err) {
            max = res.body.num;
          }
          return _this3.fetchComic(Math.floor(Math.random() * max + 1));
        });
      });

      this.responds(/^xkcd (\d+)$/i, function (matches) {
        return _this3.fetchComic(matches[1]);
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'xkcd';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Fetches XKCD comics';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**xkcd** [comic ID] - Returns the comic with the specified ID (optional)']];
    }
  }]);

  return XKCD;
}(_BaseCommand3.default);

module.exports = XKCD;
//# sourceMappingURL=xkcd.js.map
