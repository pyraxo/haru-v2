'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ServerInfo = function (_BaseCommand) {
  _inherits(ServerInfo, _BaseCommand);

  function ServerInfo() {
    _classCallCheck(this, ServerInfo);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ServerInfo).apply(this, arguments));
  }

  _createClass(ServerInfo, [{
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^server$/i, function () {
        var rolesList = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this2.server.roles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var role = _step.value;

            if (role.name === '@everyone') continue;
            rolesList.push(role.name);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        _this2.send(_this2.channel, ['```xl', '' + _this2.server.name, 'ID: ' + _this2.server.id, 'Region: ' + _this2.server.region, 'Members: ' + _this2.server.members.length + ' (' + _this2.server.members.reduce(function (count, member) {
          count += member.status === 'online' ? 1 : 0;
          return count;
        }, 0) + ' online)', 'Owner: ' + _this2.server.owner.name + ' <' + _this2.server.owner.id + '>', 'Roles: ' + rolesList.join(', '), '```'].join('\n'));
      });
    }
  }, {
    key: 'noPrivate',
    get: function get() {
      return true;
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'server';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Shows information of the server';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['```', ['server - Shows some info on the server'], 'This command cannot be run in PMs.', '```'];
    }
  }]);

  return ServerInfo;
}(_BaseCommand3.default);

module.exports = ServerInfo;
//# sourceMappingURL=server.js.map
