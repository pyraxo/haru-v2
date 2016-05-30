'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _ImageFetcher = require('../.Cache/ImageFetcher');

var _ImageFetcher2 = _interopRequireDefault(_ImageFetcher);

var _WaifuDB = require('../.Cache/WaifuDB');

var _WaifuDB2 = _interopRequireDefault(_WaifuDB);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Abyssal = function (_BaseCommand) {
  _inherits(Abyssal, _BaseCommand);

  function Abyssal() {
    _classCallCheck(this, Abyssal);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Abyssal).apply(this, arguments));
  }

  _createClass(Abyssal, [{
    key: 'abyssalGet',
    value: function abyssalGet(name, url) {
      this.send(this.channel, 'Your abyssal is ' + name + '\n' + url);
    }
  }, {
    key: 'noPictures',
    value: function noPictures(query) {
      this.logger.error('**Error**: Query "' + query.split('+').join(', ') + '"' + ' returned no pictures.');
      this.getWaifu();
    }
  }, {
    key: 'fetchGB',
    value: function fetchGB(res, query, name) {
      var r = [];
      try {
        r = JSON.parse(res.text)[0];
      } catch (err) {
        this.logger.error('Error fetching \'' + query + '\'', err);
        this.reply('Error fetching \'' + query + '\' - ' + err);
        return;
      }
      if (r && r.file_url) {
        if (r.rating === 's') {
          this.shipgirlGet(name, r.file_url);
        } else {
          this.fetchGB(res, query, name);
        }
        return;
      }
      this.reducePage(query, name);
      return;
    }
  }, {
    key: 'reducePage',
    value: function reducePage(query, name) {
      var _this2 = this;

      // Temporary workaround for tags with less than 10000 images
      (0, _ImageFetcher2.default)('gelbooru', query, this, 'limit=100').then(function (res) {
        _this2.fetchGB(res, query, name);
      });
    }
  }, {
    key: 'gelbooru',
    value: function gelbooru(name) {
      var _this3 = this;

      var query = name.split(' ').join('_');
      (0, _ImageFetcher2.default)('gelbooru', query, this, 'pid=' + Math.floor(Math.random() * 10000)).then(function (res) {
        _this3.fetchGB(res, query, name);
      });
    }
  }, {
    key: 'yandere',
    value: function yandere(name) {
      var _this4 = this;

      var query = name.split(' ').join('_');
      (0, _ImageFetcher2.default)('yandere', query, this).then(function (res) {
        var r = res.body[0];
        if (typeof r !== 'undefined') {
          _this4.abyssalGet(name, r.file_url);
        } else {
          _this4.gelbooru(name);
        }
      });
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this5 = this;

      this.responds(/^shipgirl$/i, function () {
        var data = _WaifuDB2.default.Shipgirls;
        var char = data[Math.floor(Math.random() * data.length)];
        _this5.yandere(char);
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'abyssal';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Finds you an abyssal';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**abyssal** - Finds you an abyssal']];
    }
  }]);

  return Abyssal;
}(_BaseCommand3.default);

module.exports = Abyssal;
//# sourceMappingURL=abyssals.js.map
