'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Eval = function (_BaseCommand) {
  _inherits(Eval, _BaseCommand);

  function Eval() {
    _classCallCheck(this, Eval);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Eval).apply(this, arguments));
  }

  _createClass(Eval, [{
    key: 'evalCode',
    value: function evalCode(code) {
      var _this2 = this;

      var message = void 0;
      var self = this;
      this.reply('Executing code.').then(function (msg) {
        message = msg;
        setTimeout(function () {
          var response = void 0;
          try {
            response = eval(code);
          } catch (error) {
            response = error.message + '\n\n' + error.stack;
          }

          if (Array.isArray(response) || (typeof response === 'undefined' ? 'undefined' : _typeof(response)) === 'object') {
            response = _util2.default.inspect(response);
          }

          _this2.client.updateMessage(message, '```xl\n' + response + '\n```').catch(function (err) {
            _this2.logger.error('Message update for eval failed', err);
            _this2.client.updateMessage(message, '```\nError while updating message:\n' + err + '\n```');
          });
        }, 500);
      }).catch(this.logger.error);
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this3 = this;

      this.responds(/^eval(?:\s+)```[a-z]*\n([\s\S]*)?\n```$/, function (matches) {
        _this3.evalCode(matches[1]);
      });

      this.responds(/^eval(?:\s+)`?([^`]*)?`?$/, function (matches) {
        _this3.evalCode(matches[1]);
      });
    }
  }, {
    key: 'adminOnly',
    get: function get() {
      return true;
    }
  }, {
    key: 'hidden',
    get: function get() {
      return true;
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'eval';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Evaluates the given code';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['```', ['eval <code> - Executes eval on the code'], '```'];
    }
  }]);

  return Eval;
}(_BaseCommand3.default);

module.exports = Eval;
//# sourceMappingURL=eval.js.map
