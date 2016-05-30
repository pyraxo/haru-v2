'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cache = function () {
  function Cache() {
    _classCallCheck(this, Cache);

    this.db = {};
  }

  _createClass(Cache, [{
    key: 'add',
    value: function add(id, val) {
      this.db[id] = val;
      return this.db;
    }
  }, {
    key: 'get',
    value: function get(id) {
      return this.db[id];
    }
  }, {
    key: 'has',
    value: function has(id) {
      return typeof this.db[id] !== 'undefined';
    }
  }]);

  return Cache;
}();

var cache = new Cache();
module.exports = cache;
//# sourceMappingURL=Cache.js.map
