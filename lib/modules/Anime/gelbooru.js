'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _ImageFetcher = require('../.Cache/ImageFetcher');

var _ImageFetcher2 = _interopRequireDefault(_ImageFetcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Gelbooru = function (_BaseCommand) {
  _inherits(Gelbooru, _BaseCommand);

  function Gelbooru() {
    _classCallCheck(this, Gelbooru);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Gelbooru).apply(this, arguments));
  }

  _createClass(Gelbooru, [{
    key: 'noPictures',
    value: function noPictures(query) {
      this.send(this.channel, '**Error**: Query "' + query.split('+').join(', ') + '"' + ' returned no pictures.');
    }
  }, {
    key: 'reducePage',
    value: function reducePage(query) {
      var _this2 = this;

      // Temporary workaround for tags with far less than 10000 images
      (0, _ImageFetcher2.default)('gelbooru', query, this, 'limit=100').then(function (res) {
        _this2.fetchResults(res, query);
      });
    }
  }, {
    key: 'fetchResults',
    value: function fetchResults(res, query) {
      var r = [];
      try {
        r = JSON.parse(res.text)[0];
      } catch (err) {
        this.noPictures(query);
        return;
      }
      if (r && r.file_url) {
        this.send(this.channel, ['**Score**: ' + r.score, r.file_url].join('\n'));
        return;
      }
      this.reducePage(query);
    }
  }, {
    key: 'getImage',
    value: function getImage(query, pid) {
      var _this3 = this;

      pid = pid || 10000;
      (0, _ImageFetcher2.default)('gelbooru', query, this, 'pid=' + Math.floor(Math.random() * pid)).then(function (res) {
        _this3.fetchResults(res, query);
      });
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this4 = this;

      this.responds(/^gelbooru$/i, function () {
        _this4.getImage();
      });

      this.responds(/^gelbooru (.+)$/i, function (matches) {
        var query = matches[1].split(' ').join('+');
        _this4.getImage(query);
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'gelbooru';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Searches the Gelbooru image board';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**gelbooru** [tags...] - Searches danbooru']];
    }
  }]);

  return Gelbooru;
}(_BaseCommand3.default);

module.exports = Gelbooru;
//# sourceMappingURL=gelbooru.js.map
