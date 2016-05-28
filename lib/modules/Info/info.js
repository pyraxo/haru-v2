'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Info = function (_BaseCommand) {
  _inherits(Info, _BaseCommand);

  function Info() {
    _classCallCheck(this, Info);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Info).apply(this, arguments));
  }

  _createClass(Info, [{
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^info$/i, function () {
        _this2.send(_this2.channel, ['Running on **fuyu** v' + (process.env.npm_package_version || '1.0.0'), 'I\'m designed by **pyraxo**.', 'Find my source code at https://github.com/pyraxo/haru', 'Invite me: https://pyraxo.moe/haru'].join('\n'));
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'info';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Shows information of the bot';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**info** - Shows some information of the bot']];
    }
  }]);

  return Info;
}(_BaseCommand3.default);

module.exports = Info;
//# sourceMappingURL=info.js.map
