'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Help = function (_BaseCommand) {
  _inherits(Help, _BaseCommand);

  function Help() {
    _classCallCheck(this, Help);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Help).apply(this, arguments));
  }

  _createClass(Help, [{
    key: 'getModules',
    value: function getModules() {
      var modules = (0, _requireAll2.default)(_path2.default.join(process.cwd(), 'lib/modules'));
      return modules;
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^help$/i, function () {
        var reply = [];
        var modules = _this2.getModules();
        for (var name in modules) {
          if (modules.hasOwnProperty(name)) {
            var _module = modules[name];
            if (_module.length === 0) continue;
            var mod = [];
            mod.push(name + ':');
            for (var cmdName in _module) {
              if (_module.hasOwnProperty(cmdName)) {
                var command = _module[cmdName];
                if (command.hidden === true) continue;
                mod.push('  ' + _this2.prefix + command.name + ' - ' + command.description);
              }
            }
            if (mod.length > 1) reply.push(mod.join('\n'));
          }
        }
        _this2.send(_this2.sender, '```\n' + reply.join('\n') + '\n```');
        if (!_this2.isPM) {
          _this2.reply(':envelope_with_arrow: **Check your PMs!**');
        }
      });

      this.responds(/^help (\S+)$/i, function (matches) {
        var reply = ['**' + matches[1] + '** does not exist in the usage manual'];
        var modules = _this2.getModules();
        for (var name in modules) {
          if (modules.hasOwnProperty(name)) {
            var _module2 = modules[name];
            for (var cmdName in _module2) {
              if (_module2.hasOwnProperty(cmdName)) {
                var command = _module2[cmdName];
                if ((command.adminOnly === true || command.hidden === true) && _this2.isAdmin === false) continue;
                if (command.name === matches[1]) {
                  if (Array.isArray(command.usage) && command.usage.length > 0) {
                    reply = [];
                    command.usage.forEach(function (elem) {
                      if (Array.isArray(elem)) {
                        elem.forEach(function (e) {
                          reply.push('' + _this2.prefix + e);
                        });
                      } else {
                        reply.push(elem);
                      }
                    });
                  } else if (typeof command.usage === 'string') {
                    reply = ['' + _this2.prefix + command.usage];
                  }
                  if (command.aliases.length > 0) {
                    reply.push('Aliases: `' + command.aliases.join(', ') + '`');
                  }
                }
              }
            }
          }
        }
        _this2.send(_this2.sender, reply.join('\n'));
        if (!_this2.isPM) {
          _this2.reply(':envelope_with_arrow: **Check your PMs!**');
        }
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'help';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Shows the list of commands';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['```', ['help - Shows the list of commands', 'help <command> - Displays the usage manual of the command'], '```'];
    }
  }]);

  return Help;
}(_BaseCommand3.default);

module.exports = Help;
//# sourceMappingURL=help.js.map
