'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RQFeature = function (_BaseCommand) {
  _inherits(RQFeature, _BaseCommand);

  function RQFeature() {
    _classCallCheck(this, RQFeature);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(RQFeature).apply(this, arguments));
  }

  _createClass(RQFeature, [{
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^request (.+)$/i, function (matches) {
        _this2.client.admins.forEach(function (id) {
          var admin = _this2.client.users.get('id', id);
          if (admin) {
            _this2.send(admin, ['```ruby', '== Feature Request ==', 'Requester: ' + _this2.sender.name, '```', matches[1]].join('\n'));
          }
        });
        _this2.reply('Thank you for your input!\n' + 'The admins will be looking into your request shortly.');
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'request';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Requests for a new feature';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['```', ['request <description> - Requests for a new function'], '```'];
    }
  }]);

  return RQFeature;
}(_BaseCommand3.default);

module.exports = RQFeature;
//# sourceMappingURL=request.js.map
