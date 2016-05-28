'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Choose = function (_BaseCommand) {
  _inherits(Choose, _BaseCommand);

  function Choose() {
    _classCallCheck(this, Choose);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Choose).apply(this, arguments));
  }

  _createClass(Choose, [{
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^(choose|pick) (.+)/i, function (matches) {
        var result = matches[2].split(', ');
        _this2.reply('I pick **' + _lodash2.default.sample(result) + '**!');
      });
    }
  }, {
    key: 'aliases',
    get: function get() {
      return ['pick'];
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'choose';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Makes me choose between 2 or more options';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['The **choose** command will allow the bot to choose among your given options', ['**choose** <choice 1>, <choice 2>[, choices...]'], 'e.g. `choose black and blue, white and gold, neither`', 'Reply: _I pick **white and gold**!_', 'Aliases: `pick`'];
    }
  }]);

  return Choose;
}(_BaseCommand3.default);

module.exports = Choose;
//# sourceMappingURL=choose.js.map
