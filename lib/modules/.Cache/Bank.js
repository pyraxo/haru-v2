'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SortedDatabase = require('../../util/SortedDatabase');

var _SortedDatabase2 = _interopRequireDefault(_SortedDatabase);

var _Database = require('../../util/Database');

var _Database2 = _interopRequireDefault(_Database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Claims = new _Database2.default('credits-claims');

var Bank = function (_SDB) {
  _inherits(Bank, _SDB);

  function Bank() {
    _classCallCheck(this, Bank);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Bank).call(this, 'credits'));
  }

  _createClass(Bank, [{
    key: 'initUser',
    value: function initUser(user, cb) {
      if ((typeof user === 'undefined' ? 'undefined' : _typeof(user)) === 'object') user = user.id;
      this.set(user, 100, function (err, res) {
        cb(err, 100);
      });
    }
  }, {
    key: 'getUser',
    value: function getUser(user, cb) {
      var _this2 = this;

      if ((typeof user === 'undefined' ? 'undefined' : _typeof(user)) === 'object') user = user.id;
      this.get(user, function (err, res) {
        if (!err) {
          if (res) {
            cb(null, res);
          } else {
            _this2.initUser(user, cb);
          }
        }
      });
    }
  }, {
    key: 'setCredits',
    value: function setCredits(user, amt, cb) {
      if ((typeof user === 'undefined' ? 'undefined' : _typeof(user)) === 'object') user = user.id;
      this.set(user, parseInt(amt, 10), cb);
    }
  }, {
    key: 'addCredits',
    value: function addCredits(user, amt, cb) {
      if ((typeof user === 'undefined' ? 'undefined' : _typeof(user)) === 'object') user = user.id;
      this.incr(user, parseInt(amt, 10), cb);
    }
  }, {
    key: 'delCredits',
    value: function delCredits(user, amt, cb) {
      this.addCredits(user, parseInt(-amt, 10), cb);
    }
  }, {
    key: 'sortRank',
    value: function sortRank(top, cb) {
      this.client.zrevrange(this.key, 0, parseInt(top, 10) - 1, 'withscores', function (err, res) {
        if (typeof cb === 'function') {
          if (err) return cb(err, res);
          return cb(null, res);
        }
      });
    }
  }]);

  return Bank;
}(_SortedDatabase2.default);

var CM = new Bank();
module.exports = {
  Banker: CM,
  Claims: Claims
};
//# sourceMappingURL=Bank.js.map
