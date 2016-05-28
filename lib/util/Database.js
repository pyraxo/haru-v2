'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _FlatDatabase = require('./FlatDatabase');

var _FlatDatabase2 = _interopRequireDefault(_FlatDatabase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Database = function () {
  function Database(key, options) {
    _classCallCheck(this, Database);

    options = options || new _FlatDatabase2.default(_path2.default.join(process.cwd(), 'config/redis.json'));
    this.key = key;
    this.client = _redis2.default.createClient(options.getAll());
  }

  _createClass(Database, [{
    key: '_handle',
    value: function _handle(cb, err, res) {
      if (typeof cb === 'function') {
        if (err) return cb(err, res);
        return cb(null, res);
      }
    }
  }, {
    key: 'set',
    value: function set(field, value, cb) {
      var _this = this;

      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') value = JSON.stringify(value);
      this.client.hset(this.key, field, value, function (err, res) {
        return _this._handle(cb, err, res);
      });
    }
  }, {
    key: 'get',
    value: function get(field, cb) {
      var _this2 = this;

      this.client.hget(this.key, field, function (err, res) {
        return _this2._handle(cb, err, JSON.parse(res));
      });
    }
  }, {
    key: 'has',
    value: function has(field, cb) {
      var _this3 = this;

      this.client.hexists(this.key, field, function (err, res) {
        return _this3._handle(cb, err, res);
      });
    }
  }, {
    key: 'del',
    value: function del(field, cb) {
      var _this4 = this;

      this.client.hdel(this.key, field, function (err, res) {
        return _this4._handle(cb, err, res);
      });
    }
  }, {
    key: 'getKeys',
    value: function getKeys(cb) {
      var _this5 = this;

      this.client.hkeys(this.key, function (err, res) {
        return _this5._handle(cb, err, res);
      });
    }
  }]);

  return Database;
}();

module.exports = Database;
//# sourceMappingURL=Database.js.map
