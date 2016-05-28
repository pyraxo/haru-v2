'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _escapeStringRegexp = require('escape-string-regexp');

var _escapeStringRegexp2 = _interopRequireDefault(_escapeStringRegexp);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LMGTFY = function (_BaseCommand) {
  _inherits(LMGTFY, _BaseCommand);

  function LMGTFY() {
    _classCallCheck(this, LMGTFY);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(LMGTFY).apply(this, arguments));
  }

  _createClass(LMGTFY, [{
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^lmgtfy$/i, function () {
        _this2.reply('http://lmgtfy.com/?q=how+to+use+lmgtfy');
      });

      this.responds(/^lmgtfy (.+)$/i, function (matches) {
        _this2.reply('http://lmgtfy.com/?q=' + (0, _escapeStringRegexp2.default)(matches[1].split(' ').join('+')));
      });
    }
  }, {
    key: 'aliases',
    get: function get() {
      return ['google'];
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'lmgtfy';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Let me Google that for you!';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**lmgtfy <text>**'], 'Too lazy to Google? Let this bot help Google that for you!', 'Aliases: `google`'];
    }
  }]);

  return LMGTFY;
}(_BaseCommand3.default);

module.exports = LMGTFY;
//# sourceMappingURL=lmgtfy.js.map
