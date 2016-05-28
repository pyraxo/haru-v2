'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _FlatDatabase = require('../../util/FlatDatabase');

var _FlatDatabase2 = _interopRequireDefault(_FlatDatabase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var eightball = new _FlatDatabase2.default(_path2.default.join(process.cwd(), 'db/eightball.json')).getAll();

var EightBall = function (_BaseCommand) {
  _inherits(EightBall, _BaseCommand);

  function EightBall() {
    _classCallCheck(this, EightBall);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(EightBall).apply(this, arguments));
  }

  _createClass(EightBall, [{
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^(8ball|eightball)$/i, function (matches) {
        _this2.send(_this2.channel, ':8ball: | ' + _this2.sender.name + ', what is your question?');
      });

      this.responds(/^(8ball|eightball) (.+)$/i, function (matches) {
        var reply = _lodash2.default.sample(eightball);
        _this2.send(_this2.channel, ':8ball: | ' + _this2.sender.mention() + ', **' + reply + '**');
      });
    }
  }, {
    key: 'aliases',
    get: function get() {
      return ['eightball'];
    }
  }], [{
    key: 'name',
    get: function get() {
      return '8ball';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Asks the eightball a question';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['The **8 Ball** attempts to solve your problems with its 20 preset answers.', ['**8ball <question>** will give an answer to your questions.'], 'Aliases: `eightball`'];
    }
  }]);

  return EightBall;
}(_BaseCommand3.default);

module.exports = EightBall;
//# sourceMappingURL=8ball.js.map
