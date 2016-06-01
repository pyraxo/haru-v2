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

var Whois = function (_BaseCommand) {
  _inherits(Whois, _BaseCommand);

  function Whois() {
    _classCallCheck(this, Whois);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Whois).apply(this, arguments));
  }

  _createClass(Whois, [{
    key: 'fetchUser',
    value: function fetchUser(user) {
      if (!user) {
        return 'I don\'t know that user.';
      }
      var roles = [];
      _lodash2.default.remove(this.server.rolesOf(user), function (r) {
        return r.name !== '@everyone';
      }).forEach(function (elem) {
        roles.push(elem.name);
      });
      return ['```rb', '  User: ' + user.username + '#' + user.discriminator, '    ID: ' + user.id, 'Status: ' + user.status, '  Game: ' + (user.game ? user.game.name : 'none'), '   Bot: ' + user.bot, ' Roles: ' + (roles.length > 0 ? roles.join('\n\t\t') : 'none'), '```'].join('\n');
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^(whois|whoami)$/i, function () {
        _this2.send(_this2.channel, _this2.fetchUser(_this2.sender));
        _this2.upload(_this2.sender.avatarURL);
      });

      this.responds(/^whois <@!*(\d+)>$/i, function (matches) {
        var user = _this2.client.users.get('id', matches[1]);
        _this2.send(_this2.channel, _this2.fetchUser(user));
        _this2.upload(user.avatarURL);
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'whois';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Shows information of any user';
    }
  }, {
    key: 'aliases',
    get: function get() {
      return ['whoami'];
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**whois** - Shows some info on users'], 'In PMs, use `whoami`'];
    }
  }]);

  return Whois;
}(_BaseCommand3.default);

module.exports = Whois;
//# sourceMappingURL=whois.js.map
