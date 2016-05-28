'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseClient = function () {
  function BaseClient(container) {
    _classCallCheck(this, BaseClient);

    if (this.constructor === BaseClient) {
      throw new Error('Can\'t instantiate abstract class!');
    }
    this.container = container;
  }

  _createClass(BaseClient, [{
    key: 'run',
    value: function run() {
      throw new Error('Clients must override run function');
    }
  }, {
    key: 'name',
    get: function get() {
      throw new Error('Clients must have names');
    }
  }]);

  return BaseClient;
}();

module.exports = BaseClient;
//# sourceMappingURL=BaseClient.js.map
