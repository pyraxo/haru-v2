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

var Reload = function (_BaseCommand) {
  _inherits(Reload, _BaseCommand);

  function Reload() {
    _classCallCheck(this, Reload);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Reload).apply(this, arguments));
  }

  _createClass(Reload, [{
    key: 'getModules',
    value: function getModules() {
      var modules = (0, _requireAll2.default)(_path2.default.join(process.cwd(), 'lib/modules'));
      return modules;
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^reload$/i, function () {
        var moduleNum = Object.keys(_this2.getModules()).length;
        _this2.container.get('handler').reloadModules();
        _this2.logger.info(_this2.sender.name + ' has reloaded all modules.');
        _this2.send(_this2.channel, 'Reloaded all **' + moduleNum + '** modules.');
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
      return 'reload';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Reloads all modules';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['```', ['reload - Reloads all modules'], '```'];
    }
  }]);

  return Reload;
}(_BaseCommand3.default);

module.exports = Reload;
//# sourceMappingURL=reload.js.map
