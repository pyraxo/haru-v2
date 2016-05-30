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

var Yandere = function (_BaseCommand) {
  _inherits(Yandere, _BaseCommand);

  function Yandere() {
    _classCallCheck(this, Yandere);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Yandere).apply(this, arguments));
  }

  _createClass(Yandere, [{
    key: 'noPictures',
    value: function noPictures(query) {
      this.send(this.channel, '**Error**: Query "' + query.split('+').join(', ') + '"' + ' returned no pictures.');
    }
  }, {
    key: 'getImage',
    value: function getImage(query) {
      var _this2 = this;

      (0, _ImageFetcher2.default)('yandere', query).then(function (res) {
        var r = res.body[0];
        if (typeof r !== 'undefined') {
          _this2.send(_this2.channel, '**Score**: ' + r.score + '\n' + r.file_url);
        } else {
          _this2.noPictures(query);
        }
      });
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this3 = this;

      this.responds(/^yandere$/i, function () {
        _this3.getImage();
      });

      this.responds(/^yandere (.+)$/i, function (matches) {
        var query = matches[1].split(' ').join('+');
        _this3.getImage(query);
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'yandere';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Searches the Yande.re image board';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**yandere** [tags...] - Searches yande.re']];
    }
  }]);

  return Yandere;
}(_BaseCommand3.default);

module.exports = Yandere;
//# sourceMappingURL=yandere.js.map
