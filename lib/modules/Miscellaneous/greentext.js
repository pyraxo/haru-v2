'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GreenText = function (_BaseCommand) {
  _inherits(GreenText, _BaseCommand);

  function GreenText() {
    _classCallCheck(this, GreenText);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(GreenText).apply(this, arguments));
  }

  _createClass(GreenText, [{
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^greentext (.+)$/i, function (matches) {
        var text = matches[1];
        var green = '';
        text.split(' | ').forEach(function (elem, idx) {
          green += '>' + elem + '\n';
        });
        _this2.send(_this2.channel, ['```css', green, '```'].join('\n'));
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'greentext';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Greentexts a given input';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**greentext <text>** - Greentexts your text'], 'e.g `greentext not using discord` will become:', '```css', '>not using discord', '```', 'The text can be split up with ` | ` like so:', 'e.g `greentext using skype | liking teamspeak | not using discord`:', '```css', '>using skype', '>using teamspeak', '>not using discord', '```'];
    }
  }]);

  return GreenText;
}(_BaseCommand3.default);

module.exports = GreenText;
//# sourceMappingURL=greentext.js.map
