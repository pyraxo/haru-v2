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

var Dice = function (_BaseCommand) {
  _inherits(Dice, _BaseCommand);

  function Dice() {
    _classCallCheck(this, Dice);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Dice).apply(this, arguments));
  }

  _createClass(Dice, [{
    key: 'roll',
    value: function roll() {
      var num = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
      var fac = arguments.length <= 1 || arguments[1] === undefined ? 6 : arguments[1];

      num = parseInt(num, 10);
      fac = parseInt(fac, 10);
      var result = [];
      for (var i = 0; i < num; i++) {
        result.push(Math.floor(Math.random() * fac + 1));
      }
      return result;
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^(rolldice|diceroll|dice)$/i, function () {
        _this2.send(_this2.channel, _this2.sender.name + ' rolled a **' + _this2.roll()[0] + '**!');
      });

      this.responds(/^(rolldice|diceroll|dice) (\d+)$/i, function (matches) {
        var result = _this2.roll(matches[1]);
        _this2.send(_this2.channel, ['```xl', result.join(' '), '```', 'Total: **' + _lodash2.default.sum(result) + '**']);
      });

      this.responds(/^(rolldice|diceroll|dice) d(\d+)$/i, function (matches) {
        var result = _this2.roll(1, matches[2]);
        _this2.send(_this2.channel, ['```xl', result.join(' '), '```', 'Total: **' + _lodash2.default.sum(result) + '**']);
      });

      this.responds(/^(rolldice|diceroll|dice) (\d+)d(\d+)$/i, function (matches) {
        var result = _this2.roll(matches[2], matches[3]);
        _this2.send(_this2.channel, ['```xl', result.join(' '), '```', 'Total: **' + _lodash2.default.sum(result) + '**']);
      });

      this.responds(/^(rolldice|diceroll|dice) (\d+)d(\d+)(\+|\-)(\d+)$/i, function (matches) {
        var result = _this2.roll(matches[2], matches[3], matches[4] + matches[5]);
        _this2.send(_this2.channel, ['```xl', result.join(' '), '```', 'Total: ' + _lodash2.default.sum(result) + ' ' + matches[4] + ' ' + matches[5] + ' = ' + ('**' + (_lodash2.default.sum(result) + parseInt(matches[4] + matches[5], 10)) + '**')]);
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'diceroll';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Rolls dice';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['The **diceroll** command rolls some dice and returns the result', 'The number of dice and their faces are based on dice notation (AdX)', '```', ['dice - Rolls 1 die with 6 faces`', 'dice AdX - Rolls A number of dice with X faces', 'dice AdX+B - Rolls A number of dice with X faces, adding B to the result', 'dice AdX-B - Rolls A number of dice with X faces, subtracting B from the result'], 'e.g. `dice 6d20-10`'];
    }
  }, {
    key: 'aliases',
    get: function get() {
      return ['rolldice', 'dice'];
    }
  }]);

  return Dice;
}(_BaseCommand3.default);

module.exports = Dice;
//# sourceMappingURL=diceroll.js.map
