'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RateLimiter = function () {
  function RateLimiter(limit, refresh) {
    _classCallCheck(this, RateLimiter);

    this.limit = limit || 3;
    this.refresh = refresh || 10000;
    this.db = {};
  }

  _createClass(RateLimiter, [{
    key: 'inc',
    value: function inc(user) {
      if (typeof this.db[user.id] !== 'undefined') {
        this.db[user.id] += 1;
      } else {
        this.db[user.id] = 1;
      }
    }
  }, {
    key: 'reset',
    value: function reset(user) {
      var _this = this;

      setTimeout(function () {
        delete _this.db[user.id];
      }, this.refresh);
    }
  }, {
    key: 'get',
    value: function get(user) {
      return this.db[user.id];
    }
  }, {
    key: 'isLimited',
    value: function isLimited(user) {
      var bool = this.db[user.id] >= this.limit;
      if (bool) this.reset(user);
      return bool;
    }
  }]);

  return RateLimiter;
}();

var RL = new RateLimiter();
module.exports = RL;
//# sourceMappingURL=RateLimiter.js.map
